import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'package:uuid/uuid.dart';
import 'package:omsa_api/api.dart' as omsa;
import 'package:omsa_demo_app/models/travel_models.dart';
import 'package:omsa_demo_app/models/traveler_model.dart';
import 'package:omsa_demo_app/config.dart';

class OmsaApiService {
  static final Logger _logger = Logger();
  static final Uuid _uuid = Uuid();
  static String get _apiBaseUrl {
    return bffBaseUrl.endsWith('/')
        ? bffBaseUrl.substring(0, bffBaseUrl.length - 1)
        : bffBaseUrl;
  }

  static Uri _resolveApi(String path) {
    final normalizedPath = path.startsWith('/') ? path : '/$path';
    return Uri.parse('$_apiBaseUrl$normalizedPath');
  }

  static Future<Map<String, dynamic>> _postJson({
    required Uri url,
    required Map<String, dynamic> body,
  }) async {
    _logger.i('POST $url');
    _logger.d('Request body: ${jsonEncode(body)}');

    try {
      final response = await http.post(
        url,
        headers: const {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode(body),
      );

      _logger.i('Response ${response.statusCode} from $url');
      _logger.d('Response body: ${response.body}');

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
      throw Exception(
        'Request to $url failed: ${response.statusCode} - ${response.body}',
      );
    } catch (e) {
      _logger.e('Network error calling $url: $e');
      rethrow;
    }
  }

  static Future<dynamic> _getJson({required Uri url}) async {
    _logger.i('GET $url');

    try {
      final response = await http.get(
        url,
        headers: const {'Accept': 'application/json'},
      );

      _logger.i('Response ${response.statusCode} from $url');
      _logger.d('Response body: ${response.body}');

      if (response.statusCode >= 200 && response.statusCode < 300) {
        if (response.body.isEmpty) {
          return <String, dynamic>{};
        }
        return jsonDecode(response.body);
      }
      throw Exception(
        'Request to $url failed: ${response.statusCode} - ${response.body}',
      );
    } catch (e) {
      _logger.e('Network error calling $url: $e');
      rethrow;
    }
  }

  /// Search for offers using generated OMSA API models for request construction.
  /// The response is still parsed into custom [OfferCollection] for UI compatibility.
  static Future<OfferCollection> searchOffers({
    required String fromZoneId,
    required String toZoneId,
    required DateTime startTime,
    required DateTime endTime,
    required List<omsa.IndividualTraveller> travellers,
  }) async {
    if (travellers.isEmpty) {
      throw ArgumentError('At least one traveller must be provided');
    }

    final searchRequest = omsa.SearchOfferHandlerRequest(
      inputs: omsa.SearchOfferInput(
        type: 'search_offer',
        specification: omsa.TravelSpecification(
          from: omsa.PlaceReference(placeId: fromZoneId),
          to: omsa.PlaceReference(placeId: toZoneId),
          startTime: startTime.toUtc(),
          endTime: endTime.toUtc(),
        ),
        travellers: travellers,
      ),
    );

    final url = _resolveApi('/processes/search-offers/execute');
    final jsonBody = searchRequest.toJson();

    // The generated toJson() does not recursively convert nested objects to Maps.
    // We manually convert 'inputs' to a Map if it's present so we can manipulate it.
    if (searchRequest.inputs != null) {
      final inputs = searchRequest.inputs!.toJson();
      jsonBody['inputs'] = inputs;

      // Strip empty lists to avoid validation errors for optional fields
      if (inputs['travellers'] is List &&
          (inputs['travellers'] as List).isEmpty) {
        inputs.remove('travellers');
      }
      if (inputs['profiles'] is List && (inputs['profiles'] as List).isEmpty) {
        inputs.remove('profiles');
      }
      if (inputs['travellingAssets'] is List &&
          (inputs['travellingAssets'] as List).isEmpty) {
        inputs.remove('travellingAssets');
      }
    }

    final responseBody = await _postJson(
      url: url,
      body: jsonBody,
    );
    _logger.i('Successfully parsed offer collection from BFF');
    return OfferCollection.fromJson(responseBody);
  }

  static Future<Map<String, dynamic>> purchaseOffer({
    required String offerId,
    String? successUri,
  }) async {
    final url = _resolveApi('/processes/purchase-offers/execute');
    final resolvedSuccessUri = successUri ?? 'https://example.com';

    final request = omsa.PurchaseOffersProcessHandlerRequest(
      inputs: omsa.PurchaseOffersInput(
        type: 'purchase_offers',
        offerIds: [offerId],
      ),
      subscriber: omsa.Subscriber(successUri: resolvedSuccessUri),
    );

    return _postJson(url: url, body: request.toJson());
  }

  static Future<Map<String, dynamic>> confirmPackage({
    required String packageId,
  }) async {
    final url = _resolveApi('/processes/confirm-package/execute');
    final request = omsa.PurchasePackageProcessHandlerRequest(
      inputs: omsa.PackageInput(
        packageId: packageId,
        type: 'package_input',
      ),
    );

    return _postJson(url: url, body: request.toJson());
  }

  static Future<dynamic> fetchTravelDocuments({
    required String packageId,
  }) async {
    final url = _resolveApi(
      '/collections/travel-documents/items?packageId=$packageId',
    );
    return _getJson(url: url);
  }

  static Future<dynamic> fetchRefundOptions({
    required String packageId,
  }) async {
    final url = _resolveApi(
      '/processes/refund-options/items?packageId=$packageId',
    );
    return _getJson(url: url);
  }

  static Future<dynamic> fetchChangeOptions({
    required String packageId,
  }) async {
    final url = _resolveApi(
      '/processes/change-options/items?packageId=$packageId',
    );
    return _getJson(url: url);
  }

  static Future<Map<String, dynamic>> cancelPackage({
    required String packageId,
  }) async {
    final url = _resolveApi('/processes/cancel-package/execute');
    final request = {
      'inputs': {
        'packageId': packageId,
        'type': 'package_input',
      },
    };

    return _postJson(url: url, body: request);
  }

  static Future<Map<String, dynamic>> claimRefund({
    required String refundOptionId,
  }) async {
    final url = _resolveApi('/processes/claim-refund-option/execute');
    final request = {
      'inputs': {
        'type': 'claim_refund_option',
        'optionId': refundOptionId,
      },
    };

    return _postJson(url: url, body: request);
  }

  static String _generateTravellerUuid() {
    return _uuid.v4();
  }

  /// Creates a list of generated [omsa.IndividualTraveller] from the app's UI [Traveler] model.
  static List<omsa.IndividualTraveller> createTravellersFromModel(
    List<Traveler> travelers,
  ) {
    return travelers.map((traveler) {
      return omsa.IndividualTraveller(
        type: 'individual_traveller',
        id: _generateTravellerUuid(),
        age: traveler.age,
      );
    }).toList();
  }
}
