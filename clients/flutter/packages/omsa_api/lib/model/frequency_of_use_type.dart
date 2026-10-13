//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// NeTEx classification of a frequency-of-use parameter.
class FrequencyOfUseType {
  /// Instantiate a new enum with the provided [value].
  const FrequencyOfUseType._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const NONE = FrequencyOfUseType._(r'NONE');
  static const UNLIMITED = FrequencyOfUseType._(r'UNLIMITED');
  static const LIMITED = FrequencyOfUseType._(r'LIMITED');
  static const TWICE_A_DAY = FrequencyOfUseType._(r'TWICE_A_DAY');
  static const SINGLE = FrequencyOfUseType._(r'SINGLE');

  /// List of all possible values in this [enum][FrequencyOfUseType].
  static const values = <FrequencyOfUseType>[
    NONE,
    UNLIMITED,
    LIMITED,
    TWICE_A_DAY,
    SINGLE,
  ];

  static FrequencyOfUseType? fromJson(dynamic value) =>
      FrequencyOfUseTypeTypeTransformer().decode(value);

  static List<FrequencyOfUseType> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <FrequencyOfUseType>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = FrequencyOfUseType.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [FrequencyOfUseType] to String,
/// and [decode] dynamic data back to [FrequencyOfUseType].
class FrequencyOfUseTypeTypeTransformer {
  factory FrequencyOfUseTypeTypeTransformer() =>
      _instance ??= const FrequencyOfUseTypeTypeTransformer._();

  const FrequencyOfUseTypeTypeTransformer._();

  String encode(FrequencyOfUseType data) => data.value;

  /// Decodes a [dynamic value][data] to a FrequencyOfUseType.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  FrequencyOfUseType? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'NONE':
          return FrequencyOfUseType.NONE;
        case r'UNLIMITED':
          return FrequencyOfUseType.UNLIMITED;
        case r'LIMITED':
          return FrequencyOfUseType.LIMITED;
        case r'TWICE_A_DAY':
          return FrequencyOfUseType.TWICE_A_DAY;
        case r'SINGLE':
          return FrequencyOfUseType.SINGLE;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [FrequencyOfUseTypeTypeTransformer] instance.
  static FrequencyOfUseTypeTypeTransformer? _instance;
}
