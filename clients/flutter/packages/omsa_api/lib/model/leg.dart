//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Leg {
  /// Returns a new [Leg] instance.
  Leg({
    this.from,
    this.via = const [],
    this.to,
    this.startTime,
    this.endTime,
    required this.id,
    required this.type,
    this.sequenceNumber = 0,
    this.traveller,
    this.state,
    this.price,
    this.products = const [],
    this.ancillaries = const [],
    this.usageValidityPeriods = const [],
    this.frequenciesOfUse = const [],
    this.mode,
    this.assets = const [],
    this.reservationRequirement,
    this.operator_,
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

  /// default string, full names etc (length 0-200)
  String id;

  String type;

  /// a bit short integer (0-100)
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  int sequenceNumber;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? traveller;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  LegState? state;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  AmountOfMoney? price;

  /// a reference to a product in the 'products' collection of the offer
  List<String> products;

  /// additional products that can be assigned to this leg, references to 'ancillaries' collection
  List<String> ancillaries;

  /// References to usage validity periods in the offer's usageValidityPeriods collection.
  List<String> usageValidityPeriods;

  /// References to frequency-of-use parameters in the offer's frequenciesOfUse collection.
  List<String> frequenciesOfUse;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Mode? mode;

  /// The physical asset(s) used for the execution of the leg
  List<String> assets;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  ReservationRequirement? reservationRequirement;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  OrganisationReference? operator_;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Leg &&
          other.from == from &&
          _deepEquality.equals(other.via, via) &&
          other.to == to &&
          other.startTime == startTime &&
          other.endTime == endTime &&
          other.id == id &&
          other.type == type &&
          other.sequenceNumber == sequenceNumber &&
          other.traveller == traveller &&
          other.state == state &&
          other.price == price &&
          _deepEquality.equals(other.products, products) &&
          _deepEquality.equals(other.ancillaries, ancillaries) &&
          _deepEquality.equals(
              other.usageValidityPeriods, usageValidityPeriods) &&
          _deepEquality.equals(other.frequenciesOfUse, frequenciesOfUse) &&
          other.mode == mode &&
          _deepEquality.equals(other.assets, assets) &&
          other.reservationRequirement == reservationRequirement &&
          other.operator_ == operator_;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (from == null ? 0 : from!.hashCode) +
      (via.hashCode) +
      (to == null ? 0 : to!.hashCode) +
      (startTime == null ? 0 : startTime!.hashCode) +
      (endTime == null ? 0 : endTime!.hashCode) +
      (id.hashCode) +
      (type.hashCode) +
      (sequenceNumber.hashCode) +
      (traveller == null ? 0 : traveller!.hashCode) +
      (state == null ? 0 : state!.hashCode) +
      (price == null ? 0 : price!.hashCode) +
      (products.hashCode) +
      (ancillaries.hashCode) +
      (usageValidityPeriods.hashCode) +
      (frequenciesOfUse.hashCode) +
      (mode == null ? 0 : mode!.hashCode) +
      (assets.hashCode) +
      (reservationRequirement == null ? 0 : reservationRequirement!.hashCode) +
      (operator_ == null ? 0 : operator_!.hashCode);

  @override
  String toString() =>
      'Leg[from=$from, via=$via, to=$to, startTime=$startTime, endTime=$endTime, id=$id, type=$type, sequenceNumber=$sequenceNumber, traveller=$traveller, state=$state, price=$price, products=$products, ancillaries=$ancillaries, usageValidityPeriods=$usageValidityPeriods, frequenciesOfUse=$frequenciesOfUse, mode=$mode, assets=$assets, reservationRequirement=$reservationRequirement, operator_=$operator_]';

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
    json[r'id'] = this.id;
    json[r'type'] = this.type;
    json[r'sequenceNumber'] = this.sequenceNumber;
    if (this.traveller != null) {
      json[r'traveller'] = this.traveller;
    } else {
      json[r'traveller'] = null;
    }
    if (this.state != null) {
      json[r'state'] = this.state;
    } else {
      json[r'state'] = null;
    }
    if (this.price != null) {
      json[r'price'] = this.price;
    } else {
      json[r'price'] = null;
    }
    json[r'products'] = this.products;
    json[r'ancillaries'] = this.ancillaries;
    json[r'usageValidityPeriods'] = this.usageValidityPeriods;
    json[r'frequenciesOfUse'] = this.frequenciesOfUse;
    if (this.mode != null) {
      json[r'mode'] = this.mode;
    } else {
      json[r'mode'] = null;
    }
    json[r'assets'] = this.assets;
    if (this.reservationRequirement != null) {
      json[r'reservationRequirement'] = this.reservationRequirement;
    } else {
      json[r'reservationRequirement'] = null;
    }
    if (this.operator_ != null) {
      json[r'operator'] = this.operator_;
    } else {
      json[r'operator'] = null;
    }
    return json;
  }

  /// Returns a new [Leg] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Leg? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Leg[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Leg[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Leg(
        from: PlaceReference.fromJson(json[r'from']),
        via: PlaceReference.listFromJson(json[r'via']),
        to: PlaceReference.fromJson(json[r'to']),
        startTime: mapDateTime(json, r'startTime', r''),
        endTime: mapDateTime(json, r'endTime', r''),
        id: mapValueOfType<String>(json, r'id')!,
        type: mapValueOfType<String>(json, r'type')!,
        sequenceNumber: mapValueOfType<int>(json, r'sequenceNumber') ?? 0,
        traveller: mapValueOfType<String>(json, r'traveller'),
        state: LegState.fromJson(json[r'state']),
        price: AmountOfMoney.fromJson(json[r'price']),
        products: json[r'products'] is Iterable
            ? (json[r'products'] as Iterable)
                .cast<String>()
                .toList(growable: false)
            : const [],
        ancillaries: json[r'ancillaries'] is Iterable
            ? (json[r'ancillaries'] as Iterable)
                .cast<String>()
                .toList(growable: false)
            : const [],
        usageValidityPeriods: json[r'usageValidityPeriods'] is Iterable
            ? (json[r'usageValidityPeriods'] as Iterable)
                .cast<String>()
                .toList(growable: false)
            : const [],
        frequenciesOfUse: json[r'frequenciesOfUse'] is Iterable
            ? (json[r'frequenciesOfUse'] as Iterable)
                .cast<String>()
                .toList(growable: false)
            : const [],
        mode: Mode.fromJson(json[r'mode']),
        assets: json[r'assets'] is Iterable
            ? (json[r'assets'] as Iterable)
                .cast<String>()
                .toList(growable: false)
            : const [],
        reservationRequirement:
            ReservationRequirement.fromJson(json[r'reservationRequirement']),
        operator_: OrganisationReference.fromJson(json[r'operator']),
      );
    }
    return null;
  }

  static List<Leg> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Leg>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Leg.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Leg> mapFromJson(dynamic json) {
    final map = <String, Leg>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Leg.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Leg-objects as value to a dart map
  static Map<String, List<Leg>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Leg>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Leg.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'type',
  };
}
