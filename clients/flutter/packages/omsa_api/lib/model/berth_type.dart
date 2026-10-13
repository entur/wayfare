//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class BerthType {
  /// Instantiate a new enum with the provided [value].
  const BerthType._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const SLEEPER = BerthType._(r'SLEEPER');
  static const COUCHETTE = BerthType._(r'COUCHETTE');
  static const SEAT = BerthType._(r'SEAT');
  static const OTHER = BerthType._(r'OTHER');

  /// List of all possible values in this [enum][BerthType].
  static const values = <BerthType>[
    SLEEPER,
    COUCHETTE,
    SEAT,
    OTHER,
  ];

  static BerthType? fromJson(dynamic value) =>
      BerthTypeTypeTransformer().decode(value);

  static List<BerthType> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <BerthType>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = BerthType.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [BerthType] to String,
/// and [decode] dynamic data back to [BerthType].
class BerthTypeTypeTransformer {
  factory BerthTypeTypeTransformer() =>
      _instance ??= const BerthTypeTypeTransformer._();

  const BerthTypeTypeTransformer._();

  String encode(BerthType data) => data.value;

  /// Decodes a [dynamic value][data] to a BerthType.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  BerthType? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'SLEEPER':
          return BerthType.SLEEPER;
        case r'COUCHETTE':
          return BerthType.COUCHETTE;
        case r'SEAT':
          return BerthType.SEAT;
        case r'OTHER':
          return BerthType.OTHER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [BerthTypeTypeTransformer] instance.
  static BerthTypeTypeTransformer? _instance;
}
