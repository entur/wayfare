//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// Means used to activate the usage validity period.
class ActivationMeans {
  /// Instantiate a new enum with the provided [value].
  const ActivationMeans._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const NONE_REQUIRED = ActivationMeans._(r'NONE_REQUIRED');
  static const CHECK_IN = ActivationMeans._(r'CHECK_IN');
  static const USE_OF_VALIDATOR = ActivationMeans._(r'USE_OF_VALIDATOR');
  static const USE_OF_MOBILE_DEVICE =
      ActivationMeans._(r'USE_OF_MOBILE_DEVICE');
  static const AUTOMATIC_BY_TIME = ActivationMeans._(r'AUTOMATIC_BY_TIME');
  static const AUTOMATIC_BY_PROXIMITY =
      ActivationMeans._(r'AUTOMATIC_BY_PROXIMITY');
  static const ACCESS_CODE = ActivationMeans._(r'ACCESS_CODE');
  static const OTHER = ActivationMeans._(r'OTHER');

  /// List of all possible values in this [enum][ActivationMeans].
  static const values = <ActivationMeans>[
    NONE_REQUIRED,
    CHECK_IN,
    USE_OF_VALIDATOR,
    USE_OF_MOBILE_DEVICE,
    AUTOMATIC_BY_TIME,
    AUTOMATIC_BY_PROXIMITY,
    ACCESS_CODE,
    OTHER,
  ];

  static ActivationMeans? fromJson(dynamic value) =>
      ActivationMeansTypeTransformer().decode(value);

  static List<ActivationMeans> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ActivationMeans>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ActivationMeans.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ActivationMeans] to String,
/// and [decode] dynamic data back to [ActivationMeans].
class ActivationMeansTypeTransformer {
  factory ActivationMeansTypeTransformer() =>
      _instance ??= const ActivationMeansTypeTransformer._();

  const ActivationMeansTypeTransformer._();

  String encode(ActivationMeans data) => data.value;

  /// Decodes a [dynamic value][data] to a ActivationMeans.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ActivationMeans? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'NONE_REQUIRED':
          return ActivationMeans.NONE_REQUIRED;
        case r'CHECK_IN':
          return ActivationMeans.CHECK_IN;
        case r'USE_OF_VALIDATOR':
          return ActivationMeans.USE_OF_VALIDATOR;
        case r'USE_OF_MOBILE_DEVICE':
          return ActivationMeans.USE_OF_MOBILE_DEVICE;
        case r'AUTOMATIC_BY_TIME':
          return ActivationMeans.AUTOMATIC_BY_TIME;
        case r'AUTOMATIC_BY_PROXIMITY':
          return ActivationMeans.AUTOMATIC_BY_PROXIMITY;
        case r'ACCESS_CODE':
          return ActivationMeans.ACCESS_CODE;
        case r'OTHER':
          return ActivationMeans.OTHER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ActivationMeansTypeTransformer] instance.
  static ActivationMeansTypeTransformer? _instance;
}
