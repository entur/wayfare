//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

/// Whether a concrete asset, such as a seat, can be selected manually, assigned automatically, or is not available for this reservation.
class AssetSelection {
  /// Instantiate a new enum with the provided [value].
  const AssetSelection._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const NOT_AVAILABLE = AssetSelection._(r'NOT_AVAILABLE');
  static const AUTO_ASSIGNED = AssetSelection._(r'AUTO_ASSIGNED');
  static const MANUAL_AVAILABLE = AssetSelection._(r'MANUAL_AVAILABLE');

  /// List of all possible values in this [enum][AssetSelection].
  static const values = <AssetSelection>[
    NOT_AVAILABLE,
    AUTO_ASSIGNED,
    MANUAL_AVAILABLE,
  ];

  static AssetSelection? fromJson(dynamic value) =>
      AssetSelectionTypeTransformer().decode(value);

  static List<AssetSelection> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <AssetSelection>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AssetSelection.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [AssetSelection] to String,
/// and [decode] dynamic data back to [AssetSelection].
class AssetSelectionTypeTransformer {
  factory AssetSelectionTypeTransformer() =>
      _instance ??= const AssetSelectionTypeTransformer._();

  const AssetSelectionTypeTransformer._();

  String encode(AssetSelection data) => data.value;

  /// Decodes a [dynamic value][data] to a AssetSelection.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  AssetSelection? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'NOT_AVAILABLE':
          return AssetSelection.NOT_AVAILABLE;
        case r'AUTO_ASSIGNED':
          return AssetSelection.AUTO_ASSIGNED;
        case r'MANUAL_AVAILABLE':
          return AssetSelection.MANUAL_AVAILABLE;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [AssetSelectionTypeTransformer] instance.
  static AssetSelectionTypeTransformer? _instance;
}
