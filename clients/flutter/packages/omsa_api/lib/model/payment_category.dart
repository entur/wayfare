//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// The category of the journalled item <br> _ALL_ - for filtering purposes only<br> <h2>TO initiated payments </h2> To request these payments, use the notifications, send a notification containing the payment confirmation.<br> _DEPOSIT_ - a deposit, to refund, use _REFUND_<br> _DAMAGE_ - extra costs that must be paid by the MP due to damage to the asset or ancillaries<br> _LOSS_ - extra costs that must be paid by the MP due to loss of asset or ancillaries<br> _STOLEN_ - the asset (and ancillaries) are stolen and should be paid for<br> _EXTRA_USAGE_ - the asset is paid for in advance, additional usage must be paid for (can also be a refund when used less! The amount should be negative in that case)<br> _FINE_ - a fine that arrived later on<br> _OTHER_ASSET_USED_ - additional costs for a replaced asset<br> _FARE_ - the normal costs of the purchased and executed leg(s)<br> _OTHER_ - unspecified<br> _CREDIT_ - generic CREDIT, e.g. for kick-backs <br> _VOUCHER_ - part of the fare that is covered by a voucher (no need to pay)<br> _REFUND_ - refund of the deposit or upfront paid fare<br> _REBATE_ - (partial) rebate of the fare<br> _REIMBURSEMENT_ - reimbursement of the fare<br>
class PaymentCategory {
  /// Instantiate a new enum with the provided [value].
  const PaymentCategory._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ALL = PaymentCategory._(r'ALL');
  static const DAMAGE = PaymentCategory._(r'DAMAGE');
  static const LOSS = PaymentCategory._(r'LOSS');
  static const STOLEN = PaymentCategory._(r'STOLEN');
  static const EXTRA_USAGE = PaymentCategory._(r'EXTRA_USAGE');
  static const REFUND = PaymentCategory._(r'REFUND');
  static const REBATE = PaymentCategory._(r'REBATE');
  static const REIMBURSEMENT = PaymentCategory._(r'REIMBURSEMENT');
  static const FINE = PaymentCategory._(r'FINE');
  static const OTHER_ASSET_USED = PaymentCategory._(r'OTHER_ASSET_USED');
  static const CREDIT = PaymentCategory._(r'CREDIT');
  static const VOUCHER = PaymentCategory._(r'VOUCHER');
  static const DEPOSIT = PaymentCategory._(r'DEPOSIT');
  static const OTHER = PaymentCategory._(r'OTHER');
  static const FARE = PaymentCategory._(r'FARE');
  static const FEE = PaymentCategory._(r'FEE');

  /// List of all possible values in this [enum][PaymentCategory].
  static const values = <PaymentCategory>[
    ALL,
    DAMAGE,
    LOSS,
    STOLEN,
    EXTRA_USAGE,
    REFUND,
    REBATE,
    REIMBURSEMENT,
    FINE,
    OTHER_ASSET_USED,
    CREDIT,
    VOUCHER,
    DEPOSIT,
    OTHER,
    FARE,
    FEE,
  ];

  static PaymentCategory? fromJson(dynamic value) =>
      PaymentCategoryTypeTransformer().decode(value);

  static List<PaymentCategory> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <PaymentCategory>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PaymentCategory.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [PaymentCategory] to String,
/// and [decode] dynamic data back to [PaymentCategory].
class PaymentCategoryTypeTransformer {
  factory PaymentCategoryTypeTransformer() =>
      _instance ??= const PaymentCategoryTypeTransformer._();

  const PaymentCategoryTypeTransformer._();

  String encode(PaymentCategory data) => data.value;

  /// Decodes a [dynamic value][data] to a PaymentCategory.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  PaymentCategory? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ALL':
          return PaymentCategory.ALL;
        case r'DAMAGE':
          return PaymentCategory.DAMAGE;
        case r'LOSS':
          return PaymentCategory.LOSS;
        case r'STOLEN':
          return PaymentCategory.STOLEN;
        case r'EXTRA_USAGE':
          return PaymentCategory.EXTRA_USAGE;
        case r'REFUND':
          return PaymentCategory.REFUND;
        case r'REBATE':
          return PaymentCategory.REBATE;
        case r'REIMBURSEMENT':
          return PaymentCategory.REIMBURSEMENT;
        case r'FINE':
          return PaymentCategory.FINE;
        case r'OTHER_ASSET_USED':
          return PaymentCategory.OTHER_ASSET_USED;
        case r'CREDIT':
          return PaymentCategory.CREDIT;
        case r'VOUCHER':
          return PaymentCategory.VOUCHER;
        case r'DEPOSIT':
          return PaymentCategory.DEPOSIT;
        case r'OTHER':
          return PaymentCategory.OTHER;
        case r'FARE':
          return PaymentCategory.FARE;
        case r'FEE':
          return PaymentCategory.FEE;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [PaymentCategoryTypeTransformer] instance.
  static PaymentCategoryTypeTransformer? _instance;
}
