//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class AssignAncillaryProcessHandlerRequest {
  /// Returns a new [AssignAncillaryProcessHandlerRequest] instance.
  AssignAncillaryProcessHandlerRequest({
    this.inputs,
    this.subscriber,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  AncillaryInput? inputs;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Subscriber? subscriber;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AssignAncillaryProcessHandlerRequest &&
          other.inputs == inputs &&
          other.subscriber == subscriber;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (inputs == null ? 0 : inputs!.hashCode) +
      (subscriber == null ? 0 : subscriber!.hashCode);

  @override
  String toString() =>
      'AssignAncillaryProcessHandlerRequest[inputs=$inputs, subscriber=$subscriber]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.inputs != null) {
      json[r'inputs'] = this.inputs;
    } else {
      json[r'inputs'] = null;
    }
    if (this.subscriber != null) {
      json[r'subscriber'] = this.subscriber;
    } else {
      json[r'subscriber'] = null;
    }
    return json;
  }

  /// Returns a new [AssignAncillaryProcessHandlerRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AssignAncillaryProcessHandlerRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "AssignAncillaryProcessHandlerRequest[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "AssignAncillaryProcessHandlerRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return AssignAncillaryProcessHandlerRequest(
        inputs: AncillaryInput.fromJson(json[r'inputs']),
        subscriber: Subscriber.fromJson(json[r'subscriber']),
      );
    }
    return null;
  }

  static List<AssignAncillaryProcessHandlerRequest> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <AssignAncillaryProcessHandlerRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AssignAncillaryProcessHandlerRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AssignAncillaryProcessHandlerRequest> mapFromJson(
      dynamic json) {
    final map = <String, AssignAncillaryProcessHandlerRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value =
            AssignAncillaryProcessHandlerRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AssignAncillaryProcessHandlerRequest-objects as value to a dart map
  static Map<String, List<AssignAncillaryProcessHandlerRequest>>
      mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<AssignAncillaryProcessHandlerRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = AssignAncillaryProcessHandlerRequest.listFromJson(
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
