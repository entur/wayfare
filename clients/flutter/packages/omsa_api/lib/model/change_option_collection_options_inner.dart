//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ChangeOptionCollectionOptionsInner {
  /// Returns a new [ChangeOptionCollectionOptionsInner] instance.
  ChangeOptionCollectionOptionsInner({
    this.id,
    this.properties,
    this.links = const [],
  });

  /// default string, full names etc (length 0-200)
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
  ChangeOption? properties;

  List<Link> links;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ChangeOptionCollectionOptionsInner &&
          other.id == id &&
          other.properties == properties &&
          _deepEquality.equals(other.links, links);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (id == null ? 0 : id!.hashCode) +
      (properties == null ? 0 : properties!.hashCode) +
      (links.hashCode);

  @override
  String toString() =>
      'ChangeOptionCollectionOptionsInner[id=$id, properties=$properties, links=$links]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.properties != null) {
      json[r'properties'] = this.properties;
    } else {
      json[r'properties'] = null;
    }
    json[r'links'] = this.links;
    return json;
  }

  /// Returns a new [ChangeOptionCollectionOptionsInner] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ChangeOptionCollectionOptionsInner? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ChangeOptionCollectionOptionsInner[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ChangeOptionCollectionOptionsInner[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ChangeOptionCollectionOptionsInner(
        id: mapValueOfType<String>(json, r'id'),
        properties: ChangeOption.fromJson(json[r'properties']),
        links: Link.listFromJson(json[r'links']),
      );
    }
    return null;
  }

  static List<ChangeOptionCollectionOptionsInner> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ChangeOptionCollectionOptionsInner>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ChangeOptionCollectionOptionsInner.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ChangeOptionCollectionOptionsInner> mapFromJson(
      dynamic json) {
    final map = <String, ChangeOptionCollectionOptionsInner>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ChangeOptionCollectionOptionsInner.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ChangeOptionCollectionOptionsInner-objects as value to a dart map
  static Map<String, List<ChangeOptionCollectionOptionsInner>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ChangeOptionCollectionOptionsInner>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ChangeOptionCollectionOptionsInner.listFromJson(
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
