//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// Reservation policy used by clients to decide whether reservation UI is hidden, optional, recommended, or required.
class ReservationPolicy {
  /// Instantiate a new enum with the provided [value].
  const ReservationPolicy._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const NOT_POSSIBLE = ReservationPolicy._(r'NOT_POSSIBLE');
  static const OPTIONAL = ReservationPolicy._(r'OPTIONAL');
  static const RECOMMENDED = ReservationPolicy._(r'RECOMMENDED');
  static const COMPULSORY = ReservationPolicy._(r'COMPULSORY');

  /// List of all possible values in this [enum][ReservationPolicy].
  static const values = <ReservationPolicy>[
    NOT_POSSIBLE,
    OPTIONAL,
    RECOMMENDED,
    COMPULSORY,
  ];

  static ReservationPolicy? fromJson(dynamic value) =>
      ReservationPolicyTypeTransformer().decode(value);

  static List<ReservationPolicy> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ReservationPolicy>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ReservationPolicy.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ReservationPolicy] to String,
/// and [decode] dynamic data back to [ReservationPolicy].
class ReservationPolicyTypeTransformer {
  factory ReservationPolicyTypeTransformer() =>
      _instance ??= const ReservationPolicyTypeTransformer._();

  const ReservationPolicyTypeTransformer._();

  String encode(ReservationPolicy data) => data.value;

  /// Decodes a [dynamic value][data] to a ReservationPolicy.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ReservationPolicy? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'NOT_POSSIBLE':
          return ReservationPolicy.NOT_POSSIBLE;
        case r'OPTIONAL':
          return ReservationPolicy.OPTIONAL;
        case r'RECOMMENDED':
          return ReservationPolicy.RECOMMENDED;
        case r'COMPULSORY':
          return ReservationPolicy.COMPULSORY;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ReservationPolicyTypeTransformer] instance.
  static ReservationPolicyTypeTransformer? _instance;
}
