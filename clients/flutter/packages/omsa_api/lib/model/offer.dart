//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Offer {
  /// Returns a new [Offer] instance.
  Offer({
    this.id,
    this.type,
    required this.properties,
    this.links = const [],
  });

  /// short string, display names (length 0-75)
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
  String? type;

  OfferProperties properties;

  List<Link> links;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Offer &&
          other.id == id &&
          other.type == type &&
          other.properties == properties &&
          _deepEquality.equals(other.links, links);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (id == null ? 0 : id!.hashCode) +
      (type == null ? 0 : type!.hashCode) +
      (properties.hashCode) +
      (links.hashCode);

  @override
  String toString() =>
      'Offer[id=$id, type=$type, properties=$properties, links=$links]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    json[r'properties'] = this.properties;
    json[r'links'] = this.links;
    return json;
  }

  /// Returns a new [Offer] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Offer? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Offer[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Offer[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Offer(
        id: mapValueOfType<String>(json, r'id'),
        type: mapValueOfType<String>(json, r'type'),
        properties: OfferProperties.fromJson(json[r'properties'])!,
        links: Link.listFromJson(json[r'links']),
      );
    }
    return null;
  }

  static List<Offer> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Offer>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Offer.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Offer> mapFromJson(dynamic json) {
    final map = <String, Offer>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Offer.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Offer-objects as value to a dart map
  static Map<String, List<Offer>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Offer>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Offer.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'properties',
  };
}
