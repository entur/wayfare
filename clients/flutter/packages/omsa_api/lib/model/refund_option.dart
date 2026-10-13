//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class RefundOption {
  /// Returns a new [RefundOption] instance.
  RefundOption({
    this.type,
    this.id,
    this.packageState,
    this.refundType,
    this.consequences = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? type;

  /// https://en.wikipedia.org/wiki/Universally_unique_identifier see also https://www.ietf.org/rfc/rfc4122.txt (ae76f51c-a1a6-46af-b9ab-8233564adcae)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? id;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  PackageStatus? packageState;

  RefundOptionRefundTypeEnum? refundType;

  List<FinancialDetail> consequences;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RefundOption &&
          other.type == type &&
          other.id == id &&
          other.packageState == packageState &&
          other.refundType == refundType &&
          _deepEquality.equals(other.consequences, consequences);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type == null ? 0 : type!.hashCode) +
      (id == null ? 0 : id!.hashCode) +
      (packageState == null ? 0 : packageState!.hashCode) +
      (refundType == null ? 0 : refundType!.hashCode) +
      (consequences.hashCode);

  @override
  String toString() =>
      'RefundOption[type=$type, id=$id, packageState=$packageState, refundType=$refundType, consequences=$consequences]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.packageState != null) {
      json[r'packageState'] = this.packageState;
    } else {
      json[r'packageState'] = null;
    }
    if (this.refundType != null) {
      json[r'refundType'] = this.refundType;
    } else {
      json[r'refundType'] = null;
    }
    json[r'consequences'] = this.consequences;
    return json;
  }

  /// Returns a new [RefundOption] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static RefundOption? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "RefundOption[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "RefundOption[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return RefundOption(
        type: mapValueOfType<String>(json, r'type'),
        id: mapValueOfType<String>(json, r'id'),
        packageState: PackageStatus.fromJson(json[r'packageState']),
        refundType: RefundOptionRefundTypeEnum.fromJson(json[r'refundType']),
        consequences: FinancialDetail.listFromJson(json[r'consequences']),
      );
    }
    return null;
  }

  static List<RefundOption> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <RefundOption>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = RefundOption.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, RefundOption> mapFromJson(dynamic json) {
    final map = <String, RefundOption>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = RefundOption.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of RefundOption-objects as value to a dart map
  static Map<String, List<RefundOption>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<RefundOption>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = RefundOption.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{};
}

class RefundOptionRefundTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const RefundOptionRefundTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const PACKAGE_REFUND = RefundOptionRefundTypeEnum._(r'PACKAGE_REFUND');
  static const REMOVE_TRAVELLER =
      RefundOptionRefundTypeEnum._(r'REMOVE_TRAVELLER');
  static const REMOVE_ANCILLARY =
      RefundOptionRefundTypeEnum._(r'REMOVE_ANCILLARY');

  /// List of all possible values in this [enum][RefundOptionRefundTypeEnum].
  static const values = <RefundOptionRefundTypeEnum>[
    PACKAGE_REFUND,
    REMOVE_TRAVELLER,
    REMOVE_ANCILLARY,
  ];

  static RefundOptionRefundTypeEnum? fromJson(dynamic value) =>
      RefundOptionRefundTypeEnumTypeTransformer().decode(value);

  static List<RefundOptionRefundTypeEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <RefundOptionRefundTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = RefundOptionRefundTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [RefundOptionRefundTypeEnum] to String,
/// and [decode] dynamic data back to [RefundOptionRefundTypeEnum].
class RefundOptionRefundTypeEnumTypeTransformer {
  factory RefundOptionRefundTypeEnumTypeTransformer() =>
      _instance ??= const RefundOptionRefundTypeEnumTypeTransformer._();

  const RefundOptionRefundTypeEnumTypeTransformer._();

  String encode(RefundOptionRefundTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a RefundOptionRefundTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  RefundOptionRefundTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'PACKAGE_REFUND':
          return RefundOptionRefundTypeEnum.PACKAGE_REFUND;
        case r'REMOVE_TRAVELLER':
          return RefundOptionRefundTypeEnum.REMOVE_TRAVELLER;
        case r'REMOVE_ANCILLARY':
          return RefundOptionRefundTypeEnum.REMOVE_ANCILLARY;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [RefundOptionRefundTypeEnumTypeTransformer] instance.
  static RefundOptionRefundTypeEnumTypeTransformer? _instance;
}
