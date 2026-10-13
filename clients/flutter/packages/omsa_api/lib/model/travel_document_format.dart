//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// how the travel document is presented to the traveller<br>
class TravelDocumentFormat {
  /// Instantiate a new enum with the provided [value].
  const TravelDocumentFormat._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const LINK = TravelDocumentFormat._(r'LINK');
  static const BARCODE = TravelDocumentFormat._(r'BARCODE');
  static const QRCODE = TravelDocumentFormat._(r'QRCODE');
  static const AZTECCODE = TravelDocumentFormat._(r'AZTECCODE');
  static const AXA_EKEY_OTP = TravelDocumentFormat._(r'AXA_EKEY_OTP');
  static const BLUETOOTH = TravelDocumentFormat._(r'BLUETOOTH');
  static const NFC = TravelDocumentFormat._(r'NFC');
  static const PHYSICAL_KEY = TravelDocumentFormat._(r'PHYSICAL_KEY');
  static const EXTERNAL_CARD = TravelDocumentFormat._(r'EXTERNAL_CARD');
  static const OTHER = TravelDocumentFormat._(r'OTHER');

  /// List of all possible values in this [enum][TravelDocumentFormat].
  static const values = <TravelDocumentFormat>[
    LINK,
    BARCODE,
    QRCODE,
    AZTECCODE,
    AXA_EKEY_OTP,
    BLUETOOTH,
    NFC,
    PHYSICAL_KEY,
    EXTERNAL_CARD,
    OTHER,
  ];

  static TravelDocumentFormat? fromJson(dynamic value) =>
      TravelDocumentFormatTypeTransformer().decode(value);

  static List<TravelDocumentFormat> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <TravelDocumentFormat>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TravelDocumentFormat.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [TravelDocumentFormat] to String,
/// and [decode] dynamic data back to [TravelDocumentFormat].
class TravelDocumentFormatTypeTransformer {
  factory TravelDocumentFormatTypeTransformer() =>
      _instance ??= const TravelDocumentFormatTypeTransformer._();

  const TravelDocumentFormatTypeTransformer._();

  String encode(TravelDocumentFormat data) => data.value;

  /// Decodes a [dynamic value][data] to a TravelDocumentFormat.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  TravelDocumentFormat? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'LINK':
          return TravelDocumentFormat.LINK;
        case r'BARCODE':
          return TravelDocumentFormat.BARCODE;
        case r'QRCODE':
          return TravelDocumentFormat.QRCODE;
        case r'AZTECCODE':
          return TravelDocumentFormat.AZTECCODE;
        case r'AXA_EKEY_OTP':
          return TravelDocumentFormat.AXA_EKEY_OTP;
        case r'BLUETOOTH':
          return TravelDocumentFormat.BLUETOOTH;
        case r'NFC':
          return TravelDocumentFormat.NFC;
        case r'PHYSICAL_KEY':
          return TravelDocumentFormat.PHYSICAL_KEY;
        case r'EXTERNAL_CARD':
          return TravelDocumentFormat.EXTERNAL_CARD;
        case r'OTHER':
          return TravelDocumentFormat.OTHER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [TravelDocumentFormatTypeTransformer] instance.
  static TravelDocumentFormatTypeTransformer? _instance;
}
