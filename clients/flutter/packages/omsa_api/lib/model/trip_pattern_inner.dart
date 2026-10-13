//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TripPatternInner {
  /// Returns a new [TripPatternInner] instance.
  TripPatternInner({
    this.serviceJourney,
    this.date,
    this.from,
    this.to,
  });

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? serviceJourney;

  /// https://www.rfc-editor.org/rfc/rfc3339#section-5.6, full-date (2019-10-12)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? date;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  PlaceReference? from;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  PlaceReference? to;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TripPatternInner &&
          other.serviceJourney == serviceJourney &&
          other.date == date &&
          other.from == from &&
          other.to == to;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (serviceJourney == null ? 0 : serviceJourney!.hashCode) +
      (date == null ? 0 : date!.hashCode) +
      (from == null ? 0 : from!.hashCode) +
      (to == null ? 0 : to!.hashCode);

  @override
  String toString() =>
      'TripPatternInner[serviceJourney=$serviceJourney, date=$date, from=$from, to=$to]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.serviceJourney != null) {
      json[r'serviceJourney'] = this.serviceJourney;
    } else {
      json[r'serviceJourney'] = null;
    }
    if (this.date != null) {
      json[r'date'] = this.date;
    } else {
      json[r'date'] = null;
    }
    if (this.from != null) {
      json[r'from'] = this.from;
    } else {
      json[r'from'] = null;
    }
    if (this.to != null) {
      json[r'to'] = this.to;
    } else {
      json[r'to'] = null;
    }
    return json;
  }

  /// Returns a new [TripPatternInner] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TripPatternInner? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "TripPatternInner[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "TripPatternInner[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TripPatternInner(
        serviceJourney: mapValueOfType<String>(json, r'serviceJourney'),
        date: mapValueOfType<String>(json, r'date'),
        from: PlaceReference.fromJson(json[r'from']),
        to: PlaceReference.fromJson(json[r'to']),
      );
    }
    return null;
  }

  static List<TripPatternInner> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <TripPatternInner>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TripPatternInner.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TripPatternInner> mapFromJson(dynamic json) {
    final map = <String, TripPatternInner>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TripPatternInner.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TripPatternInner-objects as value to a dart map
  static Map<String, List<TripPatternInner>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<TripPatternInner>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TripPatternInner.listFromJson(
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
