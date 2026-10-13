//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// Event that ends the usage validity period.
class UsageEnd {
  /// Instantiate a new enum with the provided [value].
  const UsageEnd._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const STANDARD_DURATION = UsageEnd._(r'STANDARD_DURATION');
  static const END_OF_CALENDAR_PERIOD = UsageEnd._(r'END_OF_CALENDAR_PERIOD');
  static const END_OF_RIDE = UsageEnd._(r'END_OF_RIDE');
  static const END_OF_TRIP = UsageEnd._(r'END_OF_TRIP');
  static const END_OF_FARE_DAY = UsageEnd._(r'END_OF_FARE_DAY');
  static const END_OF_FARE_PERIOD = UsageEnd._(r'END_OF_FARE_PERIOD');
  static const PRODUCT_EXPIRY = UsageEnd._(r'PRODUCT_EXPIRY');
  static const PROFILE_EXPIRY = UsageEnd._(r'PROFILE_EXPIRY');
  static const DEREGISTRATION = UsageEnd._(r'DEREGISTRATION');
  static const OTHER = UsageEnd._(r'OTHER');

  /// List of all possible values in this [enum][UsageEnd].
  static const values = <UsageEnd>[
    STANDARD_DURATION,
    END_OF_CALENDAR_PERIOD,
    END_OF_RIDE,
    END_OF_TRIP,
    END_OF_FARE_DAY,
    END_OF_FARE_PERIOD,
    PRODUCT_EXPIRY,
    PROFILE_EXPIRY,
    DEREGISTRATION,
    OTHER,
  ];

  static UsageEnd? fromJson(dynamic value) =>
      UsageEndTypeTransformer().decode(value);

  static List<UsageEnd> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <UsageEnd>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UsageEnd.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [UsageEnd] to String,
/// and [decode] dynamic data back to [UsageEnd].
class UsageEndTypeTransformer {
  factory UsageEndTypeTransformer() =>
      _instance ??= const UsageEndTypeTransformer._();

  const UsageEndTypeTransformer._();

  String encode(UsageEnd data) => data.value;

  /// Decodes a [dynamic value][data] to a UsageEnd.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  UsageEnd? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'STANDARD_DURATION':
          return UsageEnd.STANDARD_DURATION;
        case r'END_OF_CALENDAR_PERIOD':
          return UsageEnd.END_OF_CALENDAR_PERIOD;
        case r'END_OF_RIDE':
          return UsageEnd.END_OF_RIDE;
        case r'END_OF_TRIP':
          return UsageEnd.END_OF_TRIP;
        case r'END_OF_FARE_DAY':
          return UsageEnd.END_OF_FARE_DAY;
        case r'END_OF_FARE_PERIOD':
          return UsageEnd.END_OF_FARE_PERIOD;
        case r'PRODUCT_EXPIRY':
          return UsageEnd.PRODUCT_EXPIRY;
        case r'PROFILE_EXPIRY':
          return UsageEnd.PROFILE_EXPIRY;
        case r'DEREGISTRATION':
          return UsageEnd.DEREGISTRATION;
        case r'OTHER':
          return UsageEnd.OTHER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [UsageEndTypeTransformer] instance.
  static UsageEndTypeTransformer? _instance;
}
