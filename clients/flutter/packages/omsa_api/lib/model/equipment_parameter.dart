//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class EquipmentParameter {
  /// Returns a new [EquipmentParameter] instance.
  EquipmentParameter({
    required this.type,
    this.id,
    this.name,
    this.description,
    this.infoLink,
    this.image,
  });

  String type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  EquipmentReference? id;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? name;

  /// long string, memos etc (length 0-10.000)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  /// valid URL
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? infoLink;

  /// valid URL
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? image;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is EquipmentParameter &&
          other.type == type &&
          other.id == id &&
          other.name == name &&
          other.description == description &&
          other.infoLink == infoLink &&
          other.image == image;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (id == null ? 0 : id!.hashCode) +
      (name == null ? 0 : name!.hashCode) +
      (description == null ? 0 : description!.hashCode) +
      (infoLink == null ? 0 : infoLink!.hashCode) +
      (image == null ? 0 : image!.hashCode);

  @override
  String toString() =>
      'EquipmentParameter[type=$type, id=$id, name=$name, description=$description, infoLink=$infoLink, image=$image]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.infoLink != null) {
      json[r'infoLink'] = this.infoLink;
    } else {
      json[r'infoLink'] = null;
    }
    if (this.image != null) {
      json[r'image'] = this.image;
    } else {
      json[r'image'] = null;
    }
    return json;
  }

  /// Returns a new [EquipmentParameter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static EquipmentParameter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "EquipmentParameter[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "EquipmentParameter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return EquipmentParameter(
        type: mapValueOfType<String>(json, r'type')!,
        id: EquipmentReference.fromJson(json[r'id']),
        name: mapValueOfType<String>(json, r'name'),
        description: mapValueOfType<String>(json, r'description'),
        infoLink: mapValueOfType<String>(json, r'infoLink'),
        image: mapValueOfType<String>(json, r'image'),
      );
    }
    return null;
  }

  static List<EquipmentParameter> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <EquipmentParameter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = EquipmentParameter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, EquipmentParameter> mapFromJson(dynamic json) {
    final map = <String, EquipmentParameter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = EquipmentParameter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of EquipmentParameter-objects as value to a dart map
  static Map<String, List<EquipmentParameter>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<EquipmentParameter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = EquipmentParameter.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'type',
  };
}
