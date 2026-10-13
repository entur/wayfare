import 'dart:async';

import 'package:logger/logger.dart';

import 'package:omsa_demo_app/models/purchase_models.dart';
import 'package:omsa_demo_app/models/travel_models.dart';
import 'package:omsa_demo_app/services/omsa_api_service.dart';
import 'package:omsa_demo_app/services/payment_service.dart';
import 'package:omsa_demo_app/services/ticket_wallet_service.dart';

class PaymentPendingException implements Exception {
  final String message;

  PaymentPendingException(this.message);

  @override
  String toString() => message;
}

class PaymentFailedException implements Exception {
  final String message;

  PaymentFailedException(this.message);

  @override
  String toString() => message;
}

class PurchaseFlowService {
  PurchaseFlowService._();

  static final Logger _logger = Logger();

  static Future<PurchaseInitiation> initiatePurchase({
    required Offer offer,
  }) async {
    _logger.i('Initiating purchase for offer: ${offer.id}');
    final response = await OmsaApiService.purchaseOffer(
      offerId: offer.id,
    );

    final details = PurchaseInitiation.fromMap(
      response,
      fallbackAmount: offer.properties.price.amount,
      fallbackCurrency: offer.properties.price.currencyCode,
    );

    if (details.packageId.isEmpty) {
      throw Exception('Purchase did not return a package identifier.');
    }

    return details;
  }

  static Future<PaymentSession> createPayment({
    required PurchaseInitiation purchase,
    required String paymentType,
  }) async {
    final totalAmountString = purchase.totalAmount.toStringAsFixed(2);

    final response = await PaymentService.createPayment(
      orderId: purchase.packageId,
      orderVersion: purchase.orderVersion,
      totalAmount: totalAmountString,
      transactionAmount: totalAmountString,
      currency: purchase.currencyCode,
      paymentType: paymentType,
    );

    final session = PaymentSession.fromMap(response);

    if (session.paymentId == 0 || session.transactionId == 0) {
      throw Exception('Payment session missing identifiers.');
    }

    return session;
  }

  static Future<PaymentTerminalSession> startTerminal({
    required PaymentSession session,
    required String redirectUrl,
    String terminalLanguage = 'no_NO',
  }) async {
    final response = await PaymentService.startTerminalSession(
      paymentId: session.paymentId.toString(),
      transactionId: session.transactionId.toString(),
      redirectUrl: redirectUrl,
      terminalLanguage: terminalLanguage,
    );

    final terminal = PaymentTerminalSession.fromMap(response);

    if (terminal.terminalUri.isEmpty) {
      throw Exception('Terminal did not return a launch URL.');
    }

    return terminal;
  }

  static Future<PaymentAppClaimSession> startAppClaim({
    required PaymentSession session,
    required String description,
    required String phoneNumber,
    required String redirectUrl,
  }) async {
    final response = await PaymentService.startAppClaimSession(
      paymentId: session.paymentId.toString(),
      transactionId: session.transactionId.toString(),
      description: description,
      phoneNumber: phoneNumber,
      redirectUrl: redirectUrl,
    );

    final appClaim = PaymentAppClaimSession.fromMap(response);

    if (appClaim.appClaimUri.isEmpty) {
      throw Exception('App claim did not return a launch URL.');
    }

    return appClaim;
  }

  static Future<PaymentCaptureResult> capturePayment({
    required PaymentSession session,
  }) async {
    final response = await PaymentService.captureTransaction(
      paymentId: session.paymentId.toString(),
      transactionId: session.transactionId.toString(),
    );

    return PaymentCaptureResult.fromMap(response);
  }

  static Future<PaymentCaptureResult?> capturePaymentIfPossible({
    required PaymentSession session,
  }) async {
    try {
      return await capturePayment(session: session);
    } catch (error, stackTrace) {
      _logger.w(
        'Capture skipped/failed for paymentId=${session.paymentId}, transactionId=${session.transactionId}: $error',
        error: error,
        stackTrace: stackTrace,
      );
      return null;
    }
  }

  static Future<Map<String, dynamic>> getPaymentTransaction({
    required PaymentSession session,
  }) async {
    return PaymentService.getTransaction(
      paymentId: session.paymentId.toString(),
      transactionId: session.transactionId.toString(),
    );
  }

  static Future<void> waitForCaptureCompletion({
    required PaymentSession session,
    int maxAttempts = 15,
    Duration pollInterval = const Duration(seconds: 2),
  }) async {
    String remaining = 'unknown';
    String status = 'UNKNOWN';

    for (var attempt = 1; attempt <= maxAttempts; attempt++) {
      final transaction = await getPaymentTransaction(session: session);
      status = _extractTransactionStatus(transaction);
      if (_isTerminalPaymentFailure(status)) {
        throw PaymentFailedException(
          'Payment failed with status=$status for paymentId=${session.paymentId}, transactionId=${session.transactionId}.',
        );
      }

      if (_isCaptureCompleted(
        transaction,
        expectedAmountRaw: session.totalAmount,
      )) {
        _logger.i(
          'Capture confirmed for paymentId=${session.paymentId}, transactionId=${session.transactionId} on attempt $attempt.',
        );
        return;
      }

      final remainingValue = _extractRemainingAmount(transaction);
      if (remainingValue != null) {
        remaining = remainingValue.toStringAsFixed(2);
      }
      _logger.i(
        'Capture pending for paymentId=${session.paymentId}, transactionId=${session.transactionId}. status=$status. Attempt $attempt/$maxAttempts, remainingAmountToCapture=$remaining.',
      );
      if (attempt < maxAttempts) {
        await Future.delayed(pollInterval);
      }
    }

    throw PaymentPendingException(
      'Payment is still processing (status=$status, remainingAmountToCapture=$remaining). Please wait and try again shortly.',
    );
  }

  static Future<ConfirmedPackage> confirmPackage({
    required PurchaseInitiation purchase,
  }) async {
    final response = await OmsaApiService.confirmPackage(
      packageId: purchase.packageId,
    );

    final confirmation = ConfirmedPackage.fromMap(response);

    if (confirmation.packageId.isEmpty) {
      throw Exception('Package confirmation failed to return an id.');
    }

    return confirmation;
  }

  static Future<ConfirmedPackage> confirmPackageWithRetry({
    required PurchaseInitiation purchase,
    int maxAttempts = 5,
    Duration retryDelay = const Duration(seconds: 2),
  }) async {
    Object? lastError;

    for (var attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await confirmPackage(purchase: purchase);
      } catch (error) {
        lastError = error;
        final isLockedError = _isLockedPackageError(error.toString());
        if (!isLockedError || attempt == maxAttempts) {
          rethrow;
        }

        final wait = Duration(
          milliseconds: retryDelay.inMilliseconds * attempt,
        );
        _logger.w(
          'Confirm package locked (attempt $attempt/$maxAttempts). Retrying in ${wait.inSeconds}s...',
        );
        await Future.delayed(wait);
      }
    }

    throw lastError ?? Exception('Unknown error while confirming package.');
  }

  static Future<List<TravelDocument>> fetchTravelDocuments({
    required String packageId,
  }) async {
    final response = await OmsaApiService.fetchTravelDocuments(
      packageId: packageId,
    );

    if (response is Map<String, dynamic>) {
      final documents = response['travelDocuments'] as List<dynamic>? ?? [];
      return documents
          .map((doc) => TravelDocument.fromMap(doc as Map<String, dynamic>))
          .toList();
    } else if (response is List) {
      return response
          .map((doc) => TravelDocument.fromMap(doc as Map<String, dynamic>))
          .toList();
    }

    return [];
  }

  static Future<List<RefundOption>> fetchRefundOptions({
    required String packageId,
  }) async {
    final response = await OmsaApiService.fetchRefundOptions(
      packageId: packageId,
    );

    if (response is Map<String, dynamic>) {
      final options = response['options'] as List<dynamic>? ?? [];
      return options
          .map((opt) => RefundOption.fromMap(opt as Map<String, dynamic>))
          .toList();
    } else if (response is List) {
      return response
          .map((opt) => RefundOption.fromMap(opt as Map<String, dynamic>))
          .toList();
    }

    return [];
  }

  static Future<List<ChangeOption>> fetchChangeOptions({
    required String packageId,
  }) async {
    final response = await OmsaApiService.fetchChangeOptions(
      packageId: packageId,
    );

    if (response is Map<String, dynamic>) {
      final options = response['options'] as List<dynamic>? ?? [];
      return options
          .map((opt) => ChangeOption.fromMap(opt as Map<String, dynamic>))
          .toList();
    } else if (response is List) {
      return response
          .map((opt) => ChangeOption.fromMap(opt as Map<String, dynamic>))
          .toList();
    }

    return [];
  }

  static Future<Map<String, dynamic>> executeCancelPackage({
    required String packageId,
  }) async {
    _logger.i('Executing cancel-package for packageId=$packageId');
    final response = await OmsaApiService.cancelPackage(packageId: packageId);
    _logger.i('Cancel-package response: $response');
    return response;
  }

  static Future<Map<String, dynamic>> executeClaimRefund({
    required String refundOptionId,
  }) async {
    _logger.i('Executing claim-refund-option for optionId=$refundOptionId');
    final response = await OmsaApiService.claimRefund(
      refundOptionId: refundOptionId,
    );
    _logger.i('Claim-refund response: $response');
    return response;
  }

  static Future<void> cacheConfirmedPackage({
    required String packageId,
    String? packageName,
    String? packageDescription,
    double? totalAmount,
    String? currencyCode,
    String? status,
  }) async {
    await TicketWalletService.rememberPackage(
      packageId: packageId,
      packageName: packageName,
      packageDescription: packageDescription,
      totalAmount: totalAmount,
      currencyCode: currencyCode,
      status: status,
    );
    try {
      final documents = await fetchTravelDocuments(packageId: packageId);
      await TicketWalletService.upsertPackage(
        packageId: packageId,
        documents: documents,
        packageName: packageName,
        packageDescription: packageDescription,
        totalAmount: totalAmount,
        currencyCode: currencyCode,
        status: status,
      );
    } catch (error, stackTrace) {
      _logger.w(
        'Failed to cache travel documents for packageId=$packageId: $error',
        error: error,
        stackTrace: stackTrace,
      );
    }
  }

  static bool _isLockedPackageError(String message) {
    final normalized = message.toLowerCase();
    return normalized.contains('status=423') ||
        normalized.contains('"status":423') ||
        normalized.contains('client error : 423');
  }

  static bool _isCaptureCompleted(
    Map<String, dynamic> transaction, {
    required String expectedAmountRaw,
  }) {
    final remainingAmount = _extractRemainingAmount(transaction);
    if (remainingAmount != null && remainingAmount <= 0.0001) {
      return true;
    }

    return _hasSuccessfulCaptureOperation(
      transaction,
      expectedAmount: _parseAmount(expectedAmountRaw),
    );
  }

  static bool _hasSuccessfulCaptureOperation(
    Map<String, dynamic> transaction, {
    required double? expectedAmount,
  }) {
    final operationLog = transaction['operationLog'];
    if (operationLog is! List) {
      return false;
    }

    for (final entry in operationLog) {
      if (entry is! Map<String, dynamic>) {
        continue;
      }

      final operation =
          (entry['operation'] ?? entry['operationType'] ?? entry['type'])
              ?.toString()
              .toUpperCase() ??
          '';
      if (operation != 'CAPTURE') {
        continue;
      }

      final status =
          (entry['status'] ?? entry['result'] ?? entry['state'] ?? '')
              .toString()
              .toUpperCase();
      final isSuccess =
          status.isEmpty ||
          status.contains('SUCCESS') ||
          status.contains('SUCCEEDED') ||
          status.contains('COMPLETED') ||
          status == 'OK';
      if (!isSuccess) {
        continue;
      }

      if (expectedAmount == null) {
        return true;
      }

      final amountValue = entry['amount'];
      final capturedAmount = amountValue is Map<String, dynamic>
          ? _parseAmount(amountValue['amount'])
          : _parseAmount(amountValue);
      if (capturedAmount != null &&
          (capturedAmount - expectedAmount).abs() <= 0.0001) {
        return true;
      }
    }

    return false;
  }

  static double? _extractRemainingAmount(Map<String, dynamic> transaction) {
    final summary = transaction['summary'];
    if (summary is Map<String, dynamic>) {
      final parsed = _parseAmount(summary['remainingAmountToCapture']);
      if (parsed != null) {
        return parsed;
      }
    }
    return _parseAmount(transaction['remainingAmountToCapture']);
  }

  static double? _parseAmount(dynamic value) {
    if (value == null) {
      return null;
    }
    if (value is num) {
      return value.toDouble();
    }
    final raw = value.toString().trim();
    if (raw.isEmpty) {
      return null;
    }
    return double.tryParse(raw.replaceAll(',', '.'));
  }

  static String _extractTransactionStatus(Map<String, dynamic> transaction) {
    return (transaction['status']?.toString() ?? 'UNKNOWN').toUpperCase();
  }

  static bool _isTerminalPaymentFailure(String status) {
    return status == 'ABORTED' ||
        status == 'CANCELLED' ||
        status == 'CANCELED' ||
        status == 'DECLINED' ||
        status == 'FAILED' ||
        status == 'REJECTED' ||
        status == 'EXPIRED';
  }
}
