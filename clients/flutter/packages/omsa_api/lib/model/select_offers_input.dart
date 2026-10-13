//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class SelectOffersInput {
  /// Returns a new [SelectOffersInput] instance.
  SelectOffersInput({
    this.offerIds = const [],
    required this.type,
    this.customer,
    this.contact,
    this.externalReference,
  });

  List<String> offerIds;

  String type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  CustomerRef? customer;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  CustomerRef? contact;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? externalReference;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is SelectOffersInput &&
          _deepEquality.equals(other.offerIds, offerIds) &&
          other.type == type &&
          other.customer == customer &&
          other.contact == contact &&
          other.externalReference == externalReference;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (offerIds.hashCode) +
      (type.hashCode) +
      (customer == null ? 0 : customer!.hashCode) +
      (contact == null ? 0 : contact!.hashCode) +
      (externalReference == null ? 0 : externalReference!.hashCode);

  @override
  String toString() =>
      'SelectOffersInput[offerIds=$offerIds, type=$type, customer=$customer, contact=$contact, externalReference=$externalReference]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'offerIds'] = this.offerIds;
    json[r'type'] = this.type;
    if (this.customer != null) {
      json[r'customer'] = this.customer;
    } else {
      json[r'customer'] = null;
    }
    if (this.contact != null) {
      json[r'contact'] = this.contact;
    } else {
      json[r'contact'] = null;
    }
    if (this.externalReference != null) {
      json[r'externalReference'] = this.externalReference;
    } else {
      json[r'externalReference'] = null;
    }
    return json;
  }

  /// Returns a new [SelectOffersInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static SelectOffersInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "SelectOffersInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "SelectOffersInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return SelectOffersInput(
        offerIds: json[r'offerIds'] is Iterable
            ? (json[r'offerIds'] as Iterable)
                .cast<String>()
                .toList(growable: false)
            : const [],
        type: mapValueOfType<String>(json, r'type')!,
        customer: CustomerRef.fromJson(json[r'customer']),
        contact: CustomerRef.fromJson(json[r'contact']),
        externalReference: mapValueOfType<String>(json, r'externalReference'),
      );
    }
    return null;
  }

  static List<SelectOffersInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <SelectOffersInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SelectOffersInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SelectOffersInput> mapFromJson(dynamic json) {
    final map = <String, SelectOffersInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SelectOffersInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of SelectOffersInput-objects as value to a dart map
  static Map<String, List<SelectOffersInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<SelectOffersInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = SelectOffersInput.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'offerIds',
    'type',
  };
}
