//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Ancillary {
  /// Returns a new [Ancillary] instance.
  Ancillary({
    required this.ancillaryId,
    this.name,
    this.type,
    this.price,
    this.description,
    this.available,
    this.service = const [],
    this.reservationRequirements = const [],
    this.links = const [],
  });

  /// default string, full names etc (length 0-200)
  String ancillaryId;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? name;

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
  AmountOfMoney? price;

  /// A user-friendly description of the ancillary (e.g. 'Reserved seat for bike').
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? description;

  /// Number of items available in stock (inventory). Useful for creating urgency in GUI.
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? available;

  /// Service characteristics covered by this ancillary, such as service journey, class of use, asset, or accommodation.
  List<ServiceParameter> service;

  /// Reservation rules carried by this ancillary.
  List<ReservationRequirement> reservationRequirements;

  List<Link> links;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Ancillary &&
          other.ancillaryId == ancillaryId &&
          other.name == name &&
          other.type == type &&
          other.price == price &&
          other.description == description &&
          other.available == available &&
          _deepEquality.equals(other.service, service) &&
          _deepEquality.equals(
              other.reservationRequirements, reservationRequirements) &&
          _deepEquality.equals(other.links, links);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (ancillaryId.hashCode) +
      (name == null ? 0 : name!.hashCode) +
      (type == null ? 0 : type!.hashCode) +
      (price == null ? 0 : price!.hashCode) +
      (description == null ? 0 : description!.hashCode) +
      (available == null ? 0 : available!.hashCode) +
      (service.hashCode) +
      (reservationRequirements.hashCode) +
      (links.hashCode);

  @override
  String toString() =>
      'Ancillary[ancillaryId=$ancillaryId, name=$name, type=$type, price=$price, description=$description, available=$available, service=$service, reservationRequirements=$reservationRequirements, links=$links]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'ancillaryId'] = this.ancillaryId;
    if (this.name != null) {
      json[r'name'] = this.name;
    } else {
      json[r'name'] = null;
    }
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.price != null) {
      json[r'price'] = this.price;
    } else {
      json[r'price'] = null;
    }
    if (this.description != null) {
      json[r'description'] = this.description;
    } else {
      json[r'description'] = null;
    }
    if (this.available != null) {
      json[r'available'] = this.available;
    } else {
      json[r'available'] = null;
    }
    json[r'service'] = this.service;
    json[r'reservationRequirements'] = this.reservationRequirements;
    json[r'links'] = this.links;
    return json;
  }

  /// Returns a new [Ancillary] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Ancillary? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Ancillary[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Ancillary[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Ancillary(
        ancillaryId: mapValueOfType<String>(json, r'ancillaryId')!,
        name: mapValueOfType<String>(json, r'name'),
        type: mapValueOfType<String>(json, r'type'),
        price: AmountOfMoney.fromJson(json[r'price']),
        description: mapValueOfType<String>(json, r'description'),
        available: mapValueOfType<int>(json, r'available'),
        service: ServiceParameter.listFromJson(json[r'service']),
        reservationRequirements: ReservationRequirement.listFromJson(
            json[r'reservationRequirements']),
        links: Link.listFromJson(json[r'links']),
      );
    }
    return null;
  }

  static List<Ancillary> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Ancillary>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Ancillary.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Ancillary> mapFromJson(dynamic json) {
    final map = <String, Ancillary>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Ancillary.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Ancillary-objects as value to a dart map
  static Map<String, List<Ancillary>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Ancillary>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Ancillary.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'ancillaryId',
  };
}
