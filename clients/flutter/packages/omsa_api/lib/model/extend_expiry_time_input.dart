//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ExtendExpiryTimeInput {
  /// Returns a new [ExtendExpiryTimeInput] instance.
  ExtendExpiryTimeInput({
    required this.packageId,
    required this.type,
    this.extensionReason,
  });

  /// default string, full names etc (length 0-200)
  String packageId;

  String type;

  /// in case operation is EXTEND_EXPIRY_TIME, the reason for extension must be supplied here.<br> _PURCHASE_PENDING_ - The internal purchase process on the MP side is not yet finished<br> _PAYMENT_PENDING_ - The customer is in the payment process<br> _OTHER_ - unspecified
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? extensionReason;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ExtendExpiryTimeInput &&
          other.packageId == packageId &&
          other.type == type &&
          other.extensionReason == extensionReason;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (packageId.hashCode) +
      (type.hashCode) +
      (extensionReason == null ? 0 : extensionReason!.hashCode);

  @override
  String toString() =>
      'ExtendExpiryTimeInput[packageId=$packageId, type=$type, extensionReason=$extensionReason]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'packageId'] = this.packageId;
    json[r'type'] = this.type;
    if (this.extensionReason != null) {
      json[r'extensionReason'] = this.extensionReason;
    } else {
      json[r'extensionReason'] = null;
    }
    return json;
  }

  /// Returns a new [ExtendExpiryTimeInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ExtendExpiryTimeInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ExtendExpiryTimeInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ExtendExpiryTimeInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ExtendExpiryTimeInput(
        packageId: mapValueOfType<String>(json, r'packageId')!,
        type: mapValueOfType<String>(json, r'type')!,
        extensionReason: mapValueOfType<String>(json, r'extensionReason'),
      );
    }
    return null;
  }

  static List<ExtendExpiryTimeInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ExtendExpiryTimeInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ExtendExpiryTimeInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ExtendExpiryTimeInput> mapFromJson(dynamic json) {
    final map = <String, ExtendExpiryTimeInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ExtendExpiryTimeInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ExtendExpiryTimeInput-objects as value to a dart map
  static Map<String, List<ExtendExpiryTimeInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ExtendExpiryTimeInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ExtendExpiryTimeInput.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'packageId',
    'type',
  };
}
