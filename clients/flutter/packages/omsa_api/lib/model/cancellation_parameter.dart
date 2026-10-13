//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CancellationParameter {
  /// Returns a new [CancellationParameter] instance.
  CancellationParameter({
    required this.type,
    this.cancellationAllowed,
    this.cancellationFee,
    this.cancellationFeePercentage,
  });

  String type;

  /// is it possible to cancel this package?
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? cancellationAllowed;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  AmountOfMoney? cancellationFee;

  /// percentage of the offered price you have to pay when you cancel this purchased package
  ///
  /// Minimum value: 0
  /// Maximum value: 100
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  num? cancellationFeePercentage;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CancellationParameter &&
          other.type == type &&
          other.cancellationAllowed == cancellationAllowed &&
          other.cancellationFee == cancellationFee &&
          other.cancellationFeePercentage == cancellationFeePercentage;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (cancellationAllowed == null ? 0 : cancellationAllowed!.hashCode) +
      (cancellationFee == null ? 0 : cancellationFee!.hashCode) +
      (cancellationFeePercentage == null
          ? 0
          : cancellationFeePercentage!.hashCode);

  @override
  String toString() =>
      'CancellationParameter[type=$type, cancellationAllowed=$cancellationAllowed, cancellationFee=$cancellationFee, cancellationFeePercentage=$cancellationFeePercentage]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.cancellationAllowed != null) {
      json[r'cancellationAllowed'] = this.cancellationAllowed;
    } else {
      json[r'cancellationAllowed'] = null;
    }
    if (this.cancellationFee != null) {
      json[r'cancellationFee'] = this.cancellationFee;
    } else {
      json[r'cancellationFee'] = null;
    }
    if (this.cancellationFeePercentage != null) {
      json[r'cancellationFeePercentage'] = this.cancellationFeePercentage;
    } else {
      json[r'cancellationFeePercentage'] = null;
    }
    return json;
  }

  /// Returns a new [CancellationParameter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CancellationParameter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "CancellationParameter[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "CancellationParameter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CancellationParameter(
        type: mapValueOfType<String>(json, r'type')!,
        cancellationAllowed: mapValueOfType<bool>(json, r'cancellationAllowed'),
        cancellationFee: AmountOfMoney.fromJson(json[r'cancellationFee']),
        cancellationFeePercentage:
            num.parse('${json[r'cancellationFeePercentage']}'),
      );
    }
    return null;
  }

  static List<CancellationParameter> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <CancellationParameter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CancellationParameter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CancellationParameter> mapFromJson(dynamic json) {
    final map = <String, CancellationParameter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CancellationParameter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CancellationParameter-objects as value to a dart map
  static Map<String, List<CancellationParameter>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<CancellationParameter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CancellationParameter.listFromJson(
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
  };
}
