//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// How the validity period interacts with blackout periods.
class BlackoutUse {
  /// Instantiate a new enum with the provided [value].
  const BlackoutUse._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const MAY_TRAVEL_ANYTIME = BlackoutUse._(r'MAY_TRAVEL_ANYTIME');
  static const NO_TRAVEL_WITHIN_PERIOD =
      BlackoutUse._(r'NO_TRAVEL_WITHIN_PERIOD');
  static const NO_TRAVEL_WITHIN_TIMEBAND =
      BlackoutUse._(r'NO_TRAVEL_WITHIN_TIMEBAND');
  static const MAY_COMPLETE_IF_STARTED_BEFORE =
      BlackoutUse._(r'MAY_COMPLETE_IF_STARTED_BEFORE');

  /// List of all possible values in this [enum][BlackoutUse].
  static const values = <BlackoutUse>[
    MAY_TRAVEL_ANYTIME,
    NO_TRAVEL_WITHIN_PERIOD,
    NO_TRAVEL_WITHIN_TIMEBAND,
    MAY_COMPLETE_IF_STARTED_BEFORE,
  ];

  static BlackoutUse? fromJson(dynamic value) =>
      BlackoutUseTypeTransformer().decode(value);

  static List<BlackoutUse> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <BlackoutUse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = BlackoutUse.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [BlackoutUse] to String,
/// and [decode] dynamic data back to [BlackoutUse].
class BlackoutUseTypeTransformer {
  factory BlackoutUseTypeTransformer() =>
      _instance ??= const BlackoutUseTypeTransformer._();

  const BlackoutUseTypeTransformer._();

  String encode(BlackoutUse data) => data.value;

  /// Decodes a [dynamic value][data] to a BlackoutUse.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  BlackoutUse? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'MAY_TRAVEL_ANYTIME':
          return BlackoutUse.MAY_TRAVEL_ANYTIME;
        case r'NO_TRAVEL_WITHIN_PERIOD':
          return BlackoutUse.NO_TRAVEL_WITHIN_PERIOD;
        case r'NO_TRAVEL_WITHIN_TIMEBAND':
          return BlackoutUse.NO_TRAVEL_WITHIN_TIMEBAND;
        case r'MAY_COMPLETE_IF_STARTED_BEFORE':
          return BlackoutUse.MAY_COMPLETE_IF_STARTED_BEFORE;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [BlackoutUseTypeTransformer] instance.
  static BlackoutUseTypeTransformer? _instance;
}
