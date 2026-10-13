//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ExtendExpiryTimeProcessHandlerRequest {
  /// Returns a new [ExtendExpiryTimeProcessHandlerRequest] instance.
  ExtendExpiryTimeProcessHandlerRequest({
    this.inputs,
    this.subscriber,
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  ExtendExpiryTimeInput? inputs;

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
      other is ExtendExpiryTimeProcessHandlerRequest &&
          other.inputs == inputs &&
          other.subscriber == subscriber;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (inputs == null ? 0 : inputs!.hashCode) +
      (subscriber == null ? 0 : subscriber!.hashCode);

  @override
  String toString() =>
      'ExtendExpiryTimeProcessHandlerRequest[inputs=$inputs, subscriber=$subscriber]';

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

  /// Returns a new [ExtendExpiryTimeProcessHandlerRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ExtendExpiryTimeProcessHandlerRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ExtendExpiryTimeProcessHandlerRequest[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ExtendExpiryTimeProcessHandlerRequest[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ExtendExpiryTimeProcessHandlerRequest(
        inputs: ExtendExpiryTimeInput.fromJson(json[r'inputs']),
        subscriber: Subscriber.fromJson(json[r'subscriber']),
      );
    }
    return null;
  }

  static List<ExtendExpiryTimeProcessHandlerRequest> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ExtendExpiryTimeProcessHandlerRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ExtendExpiryTimeProcessHandlerRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ExtendExpiryTimeProcessHandlerRequest> mapFromJson(
      dynamic json) {
    final map = <String, ExtendExpiryTimeProcessHandlerRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value =
            ExtendExpiryTimeProcessHandlerRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ExtendExpiryTimeProcessHandlerRequest-objects as value to a dart map
  static Map<String, List<ExtendExpiryTimeProcessHandlerRequest>>
      mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ExtendExpiryTimeProcessHandlerRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ExtendExpiryTimeProcessHandlerRequest.listFromJson(
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
