//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Day {
  /// Instantiate a new enum with the provided [value].
  const Day._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const MON = Day._(r'MON');
  static const TUE = Day._(r'TUE');
  static const WED = Day._(r'WED');
  static const THU = Day._(r'THU');
  static const FRI = Day._(r'FRI');
  static const SAT = Day._(r'SAT');
  static const SUN = Day._(r'SUN');

  /// List of all possible values in this [enum][Day].
  static const values = <Day>[
    MON,
    TUE,
    WED,
    THU,
    FRI,
    SAT,
    SUN,
  ];

  static Day? fromJson(dynamic value) => DayTypeTransformer().decode(value);

  static List<Day> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Day>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Day.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [Day] to String,
/// and [decode] dynamic data back to [Day].
class DayTypeTransformer {
  factory DayTypeTransformer() => _instance ??= const DayTypeTransformer._();

  const DayTypeTransformer._();

  String encode(Day data) => data.value;

  /// Decodes a [dynamic value][data] to a Day.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  Day? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'MON':
          return Day.MON;
        case r'TUE':
          return Day.TUE;
        case r'WED':
          return Day.WED;
        case r'THU':
          return Day.THU;
        case r'FRI':
          return Day.FRI;
        case r'SAT':
          return Day.SAT;
        case r'SUN':
          return Day.SUN;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [DayTypeTransformer] instance.
  static DayTypeTransformer? _instance;
}
