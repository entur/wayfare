//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// how this type is implemented?<br>
class TypeOfTravelDocument {
  /// Instantiate a new enum with the provided [value].
  const TypeOfTravelDocument._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const LINK = TypeOfTravelDocument._(r'LINK');
  static const BARCODE = TypeOfTravelDocument._(r'BARCODE');
  static const QRCODE = TypeOfTravelDocument._(r'QRCODE');
  static const AZTECCODE = TypeOfTravelDocument._(r'AZTECCODE');
  static const AXA_EKEY_OTP = TypeOfTravelDocument._(r'AXA_EKEY_OTP');
  static const BLUETOOTH = TypeOfTravelDocument._(r'BLUETOOTH');
  static const NFC = TypeOfTravelDocument._(r'NFC');
  static const PHYSICAL_KEY = TypeOfTravelDocument._(r'PHYSICAL_KEY');
  static const EXTERNAL_CARD = TypeOfTravelDocument._(r'EXTERNAL_CARD');
  static const OTHER = TypeOfTravelDocument._(r'OTHER');

  /// List of all possible values in this [enum][TypeOfTravelDocument].
  static const values = <TypeOfTravelDocument>[
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

  static TypeOfTravelDocument? fromJson(dynamic value) =>
      TypeOfTravelDocumentTypeTransformer().decode(value);

  static List<TypeOfTravelDocument> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <TypeOfTravelDocument>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TypeOfTravelDocument.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [TypeOfTravelDocument] to String,
/// and [decode] dynamic data back to [TypeOfTravelDocument].
class TypeOfTravelDocumentTypeTransformer {
  factory TypeOfTravelDocumentTypeTransformer() =>
      _instance ??= const TypeOfTravelDocumentTypeTransformer._();

  const TypeOfTravelDocumentTypeTransformer._();

  String encode(TypeOfTravelDocument data) => data.value;

  /// Decodes a [dynamic value][data] to a TypeOfTravelDocument.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  TypeOfTravelDocument? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'LINK':
          return TypeOfTravelDocument.LINK;
        case r'BARCODE':
          return TypeOfTravelDocument.BARCODE;
        case r'QRCODE':
          return TypeOfTravelDocument.QRCODE;
        case r'AZTECCODE':
          return TypeOfTravelDocument.AZTECCODE;
        case r'AXA_EKEY_OTP':
          return TypeOfTravelDocument.AXA_EKEY_OTP;
        case r'BLUETOOTH':
          return TypeOfTravelDocument.BLUETOOTH;
        case r'NFC':
          return TypeOfTravelDocument.NFC;
        case r'PHYSICAL_KEY':
          return TypeOfTravelDocument.PHYSICAL_KEY;
        case r'EXTERNAL_CARD':
          return TypeOfTravelDocument.EXTERNAL_CARD;
        case r'OTHER':
          return TypeOfTravelDocument.OTHER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [TypeOfTravelDocumentTypeTransformer] instance.
  static TypeOfTravelDocumentTypeTransformer? _instance;
}
