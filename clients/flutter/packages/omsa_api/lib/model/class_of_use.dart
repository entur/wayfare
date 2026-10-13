//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// A classification of fare and other service classes by category of user entitled to use them. Use ECONOMY_CLASS for standard class products.
class ClassOfUse {
  /// Instantiate a new enum with the provided [value].
  const ClassOfUse._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const FIRST_CLASS = ClassOfUse._(r'FIRST_CLASS');
  static const SECOND_CLASS = ClassOfUse._(r'SECOND_CLASS');
  static const THIRD_CLASS = ClassOfUse._(r'THIRD_CLASS');
  static const ECONOMY_CLASS = ClassOfUse._(r'ECONOMY_CLASS');
  static const BUSINESS_CLASS = ClassOfUse._(r'BUSINESS_CLASS');
  static const TURISTA = ClassOfUse._(r'TURISTA');
  static const PREFERENTE = ClassOfUse._(r'PREFERENTE');
  static const PREMIUM_CLASS = ClassOfUse._(r'PREMIUM_CLASS');
  static const ANY = ClassOfUse._(r'ANY');
  static const UNKNOWN = ClassOfUse._(r'UNKNOWN');

  /// List of all possible values in this [enum][ClassOfUse].
  static const values = <ClassOfUse>[
    FIRST_CLASS,
    SECOND_CLASS,
    THIRD_CLASS,
    ECONOMY_CLASS,
    BUSINESS_CLASS,
    TURISTA,
    PREFERENTE,
    PREMIUM_CLASS,
    ANY,
    UNKNOWN,
  ];

  static ClassOfUse? fromJson(dynamic value) =>
      ClassOfUseTypeTransformer().decode(value);

  static List<ClassOfUse> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ClassOfUse>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ClassOfUse.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ClassOfUse] to String,
/// and [decode] dynamic data back to [ClassOfUse].
class ClassOfUseTypeTransformer {
  factory ClassOfUseTypeTransformer() =>
      _instance ??= const ClassOfUseTypeTransformer._();

  const ClassOfUseTypeTransformer._();

  String encode(ClassOfUse data) => data.value;

  /// Decodes a [dynamic value][data] to a ClassOfUse.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ClassOfUse? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'FIRST_CLASS':
          return ClassOfUse.FIRST_CLASS;
        case r'SECOND_CLASS':
          return ClassOfUse.SECOND_CLASS;
        case r'THIRD_CLASS':
          return ClassOfUse.THIRD_CLASS;
        case r'ECONOMY_CLASS':
          return ClassOfUse.ECONOMY_CLASS;
        case r'BUSINESS_CLASS':
          return ClassOfUse.BUSINESS_CLASS;
        case r'TURISTA':
          return ClassOfUse.TURISTA;
        case r'PREFERENTE':
          return ClassOfUse.PREFERENTE;
        case r'PREMIUM_CLASS':
          return ClassOfUse.PREMIUM_CLASS;
        case r'ANY':
          return ClassOfUse.ANY;
        case r'UNKNOWN':
          return ClassOfUse.UNKNOWN;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ClassOfUseTypeTransformer] instance.
  static ClassOfUseTypeTransformer? _instance;
}
