//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Package {
  /// Returns a new [Package] instance.
  Package({
    this.from,
    this.via = const [],
    this.to,
    this.startTime,
    this.endTime,
    this.placeDefinitions = const [],
    required this.type,
    this.id,
    this.externalReference,
    required this.status,
    required this.price,
    this.offers = const [],
    this.guarantees = const [],
    this.travellers = const [],
    this.links = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  PlaceReference? from;

  /// use an ID contained in the **placeDefinitions** field, or from an external source, when using coordinates, please use the prefix 'gps:'
  List<PlaceReference> via;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  PlaceReference? to;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, date-time (2019-10-12T07:20:50.52Z)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? startTime;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, date-time (2019-10-12T07:20:50.52Z)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? endTime;

  /// Places that are not specified in an external data source (like a home address)
  List<PostalAddress> placeDefinitions;

  String type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? id;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? externalReference;

  PackageStatus status;

  AmountOfMoney price;

  List<Offer> offers;

  List<String> guarantees;

  List<PackageAllOfTravellers> travellers;

  List<Link> links;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Package &&
          other.from == from &&
          _deepEquality.equals(other.via, via) &&
          other.to == to &&
          other.startTime == startTime &&
          other.endTime == endTime &&
          _deepEquality.equals(other.placeDefinitions, placeDefinitions) &&
          other.type == type &&
          other.id == id &&
          other.externalReference == externalReference &&
          other.status == status &&
          other.price == price &&
          _deepEquality.equals(other.offers, offers) &&
          _deepEquality.equals(other.guarantees, guarantees) &&
          _deepEquality.equals(other.travellers, travellers) &&
          _deepEquality.equals(other.links, links);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (from == null ? 0 : from!.hashCode) +
      (via.hashCode) +
      (to == null ? 0 : to!.hashCode) +
      (startTime == null ? 0 : startTime!.hashCode) +
      (endTime == null ? 0 : endTime!.hashCode) +
      (placeDefinitions.hashCode) +
      (type.hashCode) +
      (id == null ? 0 : id!.hashCode) +
      (externalReference == null ? 0 : externalReference!.hashCode) +
      (status.hashCode) +
      (price.hashCode) +
      (offers.hashCode) +
      (guarantees.hashCode) +
      (travellers.hashCode) +
      (links.hashCode);

  @override
  String toString() =>
      'Package[from=$from, via=$via, to=$to, startTime=$startTime, endTime=$endTime, placeDefinitions=$placeDefinitions, type=$type, id=$id, externalReference=$externalReference, status=$status, price=$price, offers=$offers, guarantees=$guarantees, travellers=$travellers, links=$links]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.from != null) {
      json[r'from'] = this.from;
    } else {
      json[r'from'] = null;
    }
    json[r'via'] = this.via;
    if (this.to != null) {
      json[r'to'] = this.to;
    } else {
      json[r'to'] = null;
    }
    if (this.startTime != null) {
      json[r'startTime'] = this.startTime!.toUtc().toIso8601String();
    } else {
      json[r'startTime'] = null;
    }
    if (this.endTime != null) {
      json[r'endTime'] = this.endTime!.toUtc().toIso8601String();
    } else {
      json[r'endTime'] = null;
    }
    json[r'placeDefinitions'] = this.placeDefinitions;
    json[r'type'] = this.type;
    if (this.id != null) {
      json[r'id'] = this.id;
    } else {
      json[r'id'] = null;
    }
    if (this.externalReference != null) {
      json[r'externalReference'] = this.externalReference;
    } else {
      json[r'externalReference'] = null;
    }
    json[r'status'] = this.status;
    json[r'price'] = this.price;
    json[r'offers'] = this.offers;
    json[r'guarantees'] = this.guarantees;
    json[r'travellers'] = this.travellers;
    json[r'links'] = this.links;
    return json;
  }

  /// Returns a new [Package] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Package? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Package[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Package[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Package(
        from: PlaceReference.fromJson(json[r'from']),
        via: PlaceReference.listFromJson(json[r'via']),
        to: PlaceReference.fromJson(json[r'to']),
        startTime: mapDateTime(json, r'startTime', r''),
        endTime: mapDateTime(json, r'endTime', r''),
        placeDefinitions: PostalAddress.listFromJson(json[r'placeDefinitions']),
        type: mapValueOfType<String>(json, r'type')!,
        id: mapValueOfType<String>(json, r'id'),
        externalReference: mapValueOfType<String>(json, r'externalReference'),
        status: PackageStatus.fromJson(json[r'status'])!,
        price: AmountOfMoney.fromJson(json[r'price'])!,
        offers: Offer.listFromJson(json[r'offers']),
        guarantees: json[r'guarantees'] is Iterable
            ? (json[r'guarantees'] as Iterable)
                .cast<String>()
                .toList(growable: false)
            : const [],
        travellers: PackageAllOfTravellers.listFromJson(json[r'travellers']),
        links: Link.listFromJson(json[r'links']),
      );
    }
    return null;
  }

  static List<Package> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Package>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Package.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Package> mapFromJson(dynamic json) {
    final map = <String, Package>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Package.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Package-objects as value to a dart map
  static Map<String, List<Package>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Package>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Package.listFromJson(
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
    'status',
    'price',
    'offers',
  };
}
