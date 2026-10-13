//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// Event that starts the usage validity period.
class UsageTrigger {
  /// Instantiate a new enum with the provided [value].
  const UsageTrigger._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const ENROLMENT = UsageTrigger._(r'ENROLMENT');
  static const RESERVATION = UsageTrigger._(r'RESERVATION');
  static const PURCHASE = UsageTrigger._(r'PURCHASE');
  static const FULFILMENT = UsageTrigger._(r'FULFILMENT');
  static const ACTIVATION = UsageTrigger._(r'ACTIVATION');
  static const SPECIFIED_START_DATE = UsageTrigger._(r'SPECIFIED_START_DATE');
  static const START_OUTBOUND_RIDE = UsageTrigger._(r'START_OUTBOUND_RIDE');
  static const END_OUTBOUND_RIDE = UsageTrigger._(r'END_OUTBOUND_RIDE');
  static const START_RETURN_RIDE = UsageTrigger._(r'START_RETURN_RIDE');
  static const START_OF_PERIOD = UsageTrigger._(r'START_OF_PERIOD');
  static const DAY_OFFSET_BEFORE_CALENDAR_PERIOD =
      UsageTrigger._(r'DAY_OFFSET_BEFORE_CALENDAR_PERIOD');

  /// List of all possible values in this [enum][UsageTrigger].
  static const values = <UsageTrigger>[
    ENROLMENT,
    RESERVATION,
    PURCHASE,
    FULFILMENT,
    ACTIVATION,
    SPECIFIED_START_DATE,
    START_OUTBOUND_RIDE,
    END_OUTBOUND_RIDE,
    START_RETURN_RIDE,
    START_OF_PERIOD,
    DAY_OFFSET_BEFORE_CALENDAR_PERIOD,
  ];

  static UsageTrigger? fromJson(dynamic value) =>
      UsageTriggerTypeTransformer().decode(value);

  static List<UsageTrigger> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <UsageTrigger>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = UsageTrigger.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [UsageTrigger] to String,
/// and [decode] dynamic data back to [UsageTrigger].
class UsageTriggerTypeTransformer {
  factory UsageTriggerTypeTransformer() =>
      _instance ??= const UsageTriggerTypeTransformer._();

  const UsageTriggerTypeTransformer._();

  String encode(UsageTrigger data) => data.value;

  /// Decodes a [dynamic value][data] to a UsageTrigger.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  UsageTrigger? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'ENROLMENT':
          return UsageTrigger.ENROLMENT;
        case r'RESERVATION':
          return UsageTrigger.RESERVATION;
        case r'PURCHASE':
          return UsageTrigger.PURCHASE;
        case r'FULFILMENT':
          return UsageTrigger.FULFILMENT;
        case r'ACTIVATION':
          return UsageTrigger.ACTIVATION;
        case r'SPECIFIED_START_DATE':
          return UsageTrigger.SPECIFIED_START_DATE;
        case r'START_OUTBOUND_RIDE':
          return UsageTrigger.START_OUTBOUND_RIDE;
        case r'END_OUTBOUND_RIDE':
          return UsageTrigger.END_OUTBOUND_RIDE;
        case r'START_RETURN_RIDE':
          return UsageTrigger.START_RETURN_RIDE;
        case r'START_OF_PERIOD':
          return UsageTrigger.START_OF_PERIOD;
        case r'DAY_OFFSET_BEFORE_CALENDAR_PERIOD':
          return UsageTrigger.DAY_OFFSET_BEFORE_CALENDAR_PERIOD;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [UsageTriggerTypeTransformer] instance.
  static UsageTriggerTypeTransformer? _instance;
}
