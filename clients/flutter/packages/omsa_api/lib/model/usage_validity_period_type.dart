//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// NeTEx classification of a usage validity period.
class UsageValidityPeriodType {
  /// Instantiate a new enum with the provided [value].
  const UsageValidityPeriodType._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const SINGLE_RIDE = UsageValidityPeriodType._(r'SINGLE_RIDE');
  static const SINGLE_TRIP = UsageValidityPeriodType._(r'SINGLE_TRIP');
  static const RETURN_TRIP = UsageValidityPeriodType._(r'RETURN_TRIP');
  static const CARNET = UsageValidityPeriodType._(r'CARNET');
  static const DAY_PASS = UsageValidityPeriodType._(r'DAY_PASS');
  static const WEEKLY_PASS = UsageValidityPeriodType._(r'WEEKLY_PASS');
  static const WEEKEND_PASS = UsageValidityPeriodType._(r'WEEKEND_PASS');
  static const MONTHLY_PASS = UsageValidityPeriodType._(r'MONTHLY_PASS');
  static const ANNUAL_PASS = UsageValidityPeriodType._(r'ANNUAL_PASS');
  static const SEASON_TICKET = UsageValidityPeriodType._(r'SEASON_TICKET');
  static const PROFILE_MEMBERSHIP =
      UsageValidityPeriodType._(r'PROFILE_MEMBERSHIP');
  static const SUBSCRIPTION = UsageValidityPeriodType._(r'SUBSCRIPTION');
  static const OPEN_ENDED = UsageValidityPeriodType._(r'OPEN_ENDED');
  static const CAP = UsageValidityPeriodType._(r'CAP');
  static const OTHER = UsageValidityPeriodType._(r'OTHER');

  /// List of all possible values in this [enum][UsageValidityPeriodType].
  static const values = <UsageValidityPeriodType>[
    SINGLE_RIDE,
    SINGLE_TRIP,
    RETURN_TRIP,
    CARNET,
    DAY_PASS,
    WEEKLY_PASS,
    WEEKEND_PASS,
    MONTHLY_PASS,
    ANNUAL_PASS,
    SEASON_TICKET,
    PROFILE_MEMBERSHIP,
    SUBSCRIPTION,
    OPEN_ENDED,
    CAP,
    OTHER,
  ];

  static UsageValidityPeriodType? fromJson(dynamic value) =>
      UsageValidityPeriodTypeTypeTransformer().decode(value);

  static List<UsageValidityPeriodType> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <UsageValidityPeriodType>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UsageValidityPeriodType.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [UsageValidityPeriodType] to String,
/// and [decode] dynamic data back to [UsageValidityPeriodType].
class UsageValidityPeriodTypeTypeTransformer {
  factory UsageValidityPeriodTypeTypeTransformer() =>
      _instance ??= const UsageValidityPeriodTypeTypeTransformer._();

  const UsageValidityPeriodTypeTypeTransformer._();

  String encode(UsageValidityPeriodType data) => data.value;

  /// Decodes a [dynamic value][data] to a UsageValidityPeriodType.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  UsageValidityPeriodType? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'SINGLE_RIDE':
          return UsageValidityPeriodType.SINGLE_RIDE;
        case r'SINGLE_TRIP':
          return UsageValidityPeriodType.SINGLE_TRIP;
        case r'RETURN_TRIP':
          return UsageValidityPeriodType.RETURN_TRIP;
        case r'CARNET':
          return UsageValidityPeriodType.CARNET;
        case r'DAY_PASS':
          return UsageValidityPeriodType.DAY_PASS;
        case r'WEEKLY_PASS':
          return UsageValidityPeriodType.WEEKLY_PASS;
        case r'WEEKEND_PASS':
          return UsageValidityPeriodType.WEEKEND_PASS;
        case r'MONTHLY_PASS':
          return UsageValidityPeriodType.MONTHLY_PASS;
        case r'ANNUAL_PASS':
          return UsageValidityPeriodType.ANNUAL_PASS;
        case r'SEASON_TICKET':
          return UsageValidityPeriodType.SEASON_TICKET;
        case r'PROFILE_MEMBERSHIP':
          return UsageValidityPeriodType.PROFILE_MEMBERSHIP;
        case r'SUBSCRIPTION':
          return UsageValidityPeriodType.SUBSCRIPTION;
        case r'OPEN_ENDED':
          return UsageValidityPeriodType.OPEN_ENDED;
        case r'CAP':
          return UsageValidityPeriodType.CAP;
        case r'OTHER':
          return UsageValidityPeriodType.OTHER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [UsageValidityPeriodTypeTypeTransformer] instance.
  static UsageValidityPeriodTypeTypeTransformer? _instance;
}
