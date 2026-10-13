//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// Entur Offers recommendation category.
class EnturRecommendationType {
  /// Instantiate a new enum with the provided [value].
  const EnturRecommendationType._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const FLEXIBLE = EnturRecommendationType._(r'FLEXIBLE');
  static const SEMI_FLEXIBLE = EnturRecommendationType._(r'SEMI_FLEXIBLE');
  static const NON_FLEXIBLE = EnturRecommendationType._(r'NON_FLEXIBLE');
  static const CHEAPEST = EnturRecommendationType._(r'CHEAPEST');

  /// List of all possible values in this [enum][EnturRecommendationType].
  static const values = <EnturRecommendationType>[
    FLEXIBLE,
    SEMI_FLEXIBLE,
    NON_FLEXIBLE,
    CHEAPEST,
  ];

  static EnturRecommendationType? fromJson(dynamic value) =>
      EnturRecommendationTypeTypeTransformer().decode(value);

  static List<EnturRecommendationType> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <EnturRecommendationType>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EnturRecommendationType.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [EnturRecommendationType] to String,
/// and [decode] dynamic data back to [EnturRecommendationType].
class EnturRecommendationTypeTypeTransformer {
  factory EnturRecommendationTypeTypeTransformer() =>
      _instance ??= const EnturRecommendationTypeTypeTransformer._();

  const EnturRecommendationTypeTypeTransformer._();

  String encode(EnturRecommendationType data) => data.value;

  /// Decodes a [dynamic value][data] to a EnturRecommendationType.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  EnturRecommendationType? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'FLEXIBLE':
          return EnturRecommendationType.FLEXIBLE;
        case r'SEMI_FLEXIBLE':
          return EnturRecommendationType.SEMI_FLEXIBLE;
        case r'NON_FLEXIBLE':
          return EnturRecommendationType.NON_FLEXIBLE;
        case r'CHEAPEST':
          return EnturRecommendationType.CHEAPEST;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [EnturRecommendationTypeTypeTransformer] instance.
  static EnturRecommendationTypeTypeTransformer? _instance;
}
