//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// These classes are taken from the NeTeX standard, but ALL and UNKNOWN are removed. On the other hand OTHER and PARKING are added.
class Mode {
  /// Instantiate a new enum with the provided [value].
  const Mode._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const AIR = Mode._(r'AIR');
  static const BUS = Mode._(r'BUS');
  static const TROLLEYBUS = Mode._(r'TROLLEYBUS');
  static const TRAM = Mode._(r'TRAM');
  static const COACH = Mode._(r'COACH');
  static const RAIL = Mode._(r'RAIL');
  static const INTERCITYRAIL = Mode._(r'INTERCITYRAIL');
  static const URBANRAIL = Mode._(r'URBANRAIL');
  static const METRO = Mode._(r'METRO');
  static const WATER = Mode._(r'WATER');
  static const CABLEWAY = Mode._(r'CABLEWAY');
  static const FUNICULAR = Mode._(r'FUNICULAR');
  static const TAXI = Mode._(r'TAXI');
  static const SELFDRIVE = Mode._(r'SELFDRIVE');
  static const FOOT = Mode._(r'FOOT');
  static const BICYCLE = Mode._(r'BICYCLE');
  static const MOTORCYCLE = Mode._(r'MOTORCYCLE');
  static const CAR = Mode._(r'CAR');
  static const SHUTTLE = Mode._(r'SHUTTLE');
  static const OTHER = Mode._(r'OTHER');
  static const PARKING = Mode._(r'PARKING');
  static const MOPED = Mode._(r'MOPED');
  static const STEP = Mode._(r'STEP');
  static const FERRY = Mode._(r'FERRY');

  /// List of all possible values in this [enum][Mode].
  static const values = <Mode>[
    AIR,
    BUS,
    TROLLEYBUS,
    TRAM,
    COACH,
    RAIL,
    INTERCITYRAIL,
    URBANRAIL,
    METRO,
    WATER,
    CABLEWAY,
    FUNICULAR,
    TAXI,
    SELFDRIVE,
    FOOT,
    BICYCLE,
    MOTORCYCLE,
    CAR,
    SHUTTLE,
    OTHER,
    PARKING,
    MOPED,
    STEP,
    FERRY,
  ];

  static Mode? fromJson(dynamic value) => ModeTypeTransformer().decode(value);

  static List<Mode> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Mode>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Mode.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [Mode] to String,
/// and [decode] dynamic data back to [Mode].
class ModeTypeTransformer {
  factory ModeTypeTransformer() => _instance ??= const ModeTypeTransformer._();

  const ModeTypeTransformer._();

  String encode(Mode data) => data.value;

  /// Decodes a [dynamic value][data] to a Mode.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  Mode? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'AIR':
          return Mode.AIR;
        case r'BUS':
          return Mode.BUS;
        case r'TROLLEYBUS':
          return Mode.TROLLEYBUS;
        case r'TRAM':
          return Mode.TRAM;
        case r'COACH':
          return Mode.COACH;
        case r'RAIL':
          return Mode.RAIL;
        case r'INTERCITYRAIL':
          return Mode.INTERCITYRAIL;
        case r'URBANRAIL':
          return Mode.URBANRAIL;
        case r'METRO':
          return Mode.METRO;
        case r'WATER':
          return Mode.WATER;
        case r'CABLEWAY':
          return Mode.CABLEWAY;
        case r'FUNICULAR':
          return Mode.FUNICULAR;
        case r'TAXI':
          return Mode.TAXI;
        case r'SELFDRIVE':
          return Mode.SELFDRIVE;
        case r'FOOT':
          return Mode.FOOT;
        case r'BICYCLE':
          return Mode.BICYCLE;
        case r'MOTORCYCLE':
          return Mode.MOTORCYCLE;
        case r'CAR':
          return Mode.CAR;
        case r'SHUTTLE':
          return Mode.SHUTTLE;
        case r'OTHER':
          return Mode.OTHER;
        case r'PARKING':
          return Mode.PARKING;
        case r'MOPED':
          return Mode.MOPED;
        case r'STEP':
          return Mode.STEP;
        case r'FERRY':
          return Mode.FERRY;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ModeTypeTransformer] instance.
  static ModeTypeTransformer? _instance;
}
