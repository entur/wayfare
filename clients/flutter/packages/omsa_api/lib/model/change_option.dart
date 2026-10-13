//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ChangeOption {
  /// Returns a new [ChangeOption] instance.
  ChangeOption({
    this.type,
    this.id,
    this.changeType,
    this.consequences = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? id;

  ChangeOptionChangeTypeEnum? changeType;

  List<FinancialDetail> consequences;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ChangeOption &&
          other.type == type &&
          other.id == id &&
          other.changeType == changeType &&
          _deepEquality.equals(other.consequences, consequences);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type == null ? 0 : type!.hashCode) +
      (id == null ? 0 : id!.hashCode) +
      (changeType == null ? 0 : changeType!.hashCode) +
      (consequences.hashCode);

  @override
  String toString() =>
      'ChangeOption[type=$type, id=$id, changeType=$changeType, consequences=$consequences]';

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
    if (this.changeType != null) {
      json[r'changeType'] = this.changeType;
    } else {
      json[r'changeType'] = null;
    }
    json[r'consequences'] = this.consequences;
    return json;
  }

  /// Returns a new [ChangeOption] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ChangeOption? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ChangeOption[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ChangeOption[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ChangeOption(
        type: mapValueOfType<String>(json, r'type'),
        id: mapValueOfType<String>(json, r'id'),
        changeType: ChangeOptionChangeTypeEnum.fromJson(json[r'changeType']),
        consequences: FinancialDetail.listFromJson(json[r'consequences']),
      );
    }
    return null;
  }

  static List<ChangeOption> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ChangeOption>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangeOption.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ChangeOption> mapFromJson(dynamic json) {
    final map = <String, ChangeOption>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ChangeOption.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ChangeOption-objects as value to a dart map
  static Map<String, List<ChangeOption>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ChangeOption>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ChangeOption.listFromJson(
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

class ChangeOptionChangeTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const ChangeOptionChangeTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const REMOVE_TRAVELLER =
      ChangeOptionChangeTypeEnum._(r'REMOVE_TRAVELLER');
  static const ADD_TRAVELLER = ChangeOptionChangeTypeEnum._(r'ADD_TRAVELLER');
  static const UPDATE_TRAVELLER =
      ChangeOptionChangeTypeEnum._(r'UPDATE_TRAVELLER');
  static const ASSIGN_ASSET = ChangeOptionChangeTypeEnum._(r'ASSIGN_ASSET');
  static const REMOVE_ASSET = ChangeOptionChangeTypeEnum._(r'REMOVE_ASSET');
  static const ASSIGN_ANCILLARY =
      ChangeOptionChangeTypeEnum._(r'ASSIGN_ANCILLARY');
  static const REMOVE_ANCILLARY =
      ChangeOptionChangeTypeEnum._(r'REMOVE_ANCILLARY');
  static const CANCEL_PACKAGE = ChangeOptionChangeTypeEnum._(r'CANCEL_PACKAGE');
  static const UPDATE_VALIDITY =
      ChangeOptionChangeTypeEnum._(r'UPDATE_VALIDITY');
  static const UPDATE_TRAVEL_SPECIFICATION =
      ChangeOptionChangeTypeEnum._(r'UPDATE_TRAVEL_SPECIFICATION');
  static const TRANSFER_TICKET =
      ChangeOptionChangeTypeEnum._(r'TRANSFER_TICKET');

  /// List of all possible values in this [enum][ChangeOptionChangeTypeEnum].
  static const values = <ChangeOptionChangeTypeEnum>[
    REMOVE_TRAVELLER,
    ADD_TRAVELLER,
    UPDATE_TRAVELLER,
    ASSIGN_ASSET,
    REMOVE_ASSET,
    ASSIGN_ANCILLARY,
    REMOVE_ANCILLARY,
    CANCEL_PACKAGE,
    UPDATE_VALIDITY,
    UPDATE_TRAVEL_SPECIFICATION,
    TRANSFER_TICKET,
  ];

  static ChangeOptionChangeTypeEnum? fromJson(dynamic value) =>
      ChangeOptionChangeTypeEnumTypeTransformer().decode(value);

  static List<ChangeOptionChangeTypeEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ChangeOptionChangeTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangeOptionChangeTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [ChangeOptionChangeTypeEnum] to String,
/// and [decode] dynamic data back to [ChangeOptionChangeTypeEnum].
class ChangeOptionChangeTypeEnumTypeTransformer {
  factory ChangeOptionChangeTypeEnumTypeTransformer() =>
      _instance ??= const ChangeOptionChangeTypeEnumTypeTransformer._();

  const ChangeOptionChangeTypeEnumTypeTransformer._();

  String encode(ChangeOptionChangeTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a ChangeOptionChangeTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  ChangeOptionChangeTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'REMOVE_TRAVELLER':
          return ChangeOptionChangeTypeEnum.REMOVE_TRAVELLER;
        case r'ADD_TRAVELLER':
          return ChangeOptionChangeTypeEnum.ADD_TRAVELLER;
        case r'UPDATE_TRAVELLER':
          return ChangeOptionChangeTypeEnum.UPDATE_TRAVELLER;
        case r'ASSIGN_ASSET':
          return ChangeOptionChangeTypeEnum.ASSIGN_ASSET;
        case r'REMOVE_ASSET':
          return ChangeOptionChangeTypeEnum.REMOVE_ASSET;
        case r'ASSIGN_ANCILLARY':
          return ChangeOptionChangeTypeEnum.ASSIGN_ANCILLARY;
        case r'REMOVE_ANCILLARY':
          return ChangeOptionChangeTypeEnum.REMOVE_ANCILLARY;
        case r'CANCEL_PACKAGE':
          return ChangeOptionChangeTypeEnum.CANCEL_PACKAGE;
        case r'UPDATE_VALIDITY':
          return ChangeOptionChangeTypeEnum.UPDATE_VALIDITY;
        case r'UPDATE_TRAVEL_SPECIFICATION':
          return ChangeOptionChangeTypeEnum.UPDATE_TRAVEL_SPECIFICATION;
        case r'TRANSFER_TICKET':
          return ChangeOptionChangeTypeEnum.TRANSFER_TICKET;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [ChangeOptionChangeTypeEnumTypeTransformer] instance.
  static ChangeOptionChangeTypeEnumTypeTransformer? _instance;
}
