//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ServiceFilter {
  /// Returns a new [ServiceFilter] instance.
  ServiceFilter({
    required this.type,
    this.productId,
    this.serviceJourney,
    this.class_,
    this.berthTypes = const {},
  });

  String type;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? productId;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? serviceJourney;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  ClassOfUse? class_;

  Set<BerthType> berthTypes;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ServiceFilter &&
          other.type == type &&
          other.productId == productId &&
          other.serviceJourney == serviceJourney &&
          other.class_ == class_ &&
          _deepEquality.equals(other.berthTypes, berthTypes);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (productId == null ? 0 : productId!.hashCode) +
      (serviceJourney == null ? 0 : serviceJourney!.hashCode) +
      (class_ == null ? 0 : class_!.hashCode) +
      (berthTypes.hashCode);

  @override
  String toString() =>
      'ServiceFilter[type=$type, productId=$productId, serviceJourney=$serviceJourney, class_=$class_, berthTypes=$berthTypes]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.productId != null) {
      json[r'productId'] = this.productId;
    } else {
      json[r'productId'] = null;
    }
    if (this.serviceJourney != null) {
      json[r'serviceJourney'] = this.serviceJourney;
    } else {
      json[r'serviceJourney'] = null;
    }
    if (this.class_ != null) {
      json[r'class'] = this.class_;
    } else {
      json[r'class'] = null;
    }
    json[r'berthTypes'] = this.berthTypes.toList(growable: false);
    return json;
  }

  /// Returns a new [ServiceFilter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ServiceFilter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ServiceFilter[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ServiceFilter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ServiceFilter(
        type: mapValueOfType<String>(json, r'type')!,
        productId: mapValueOfType<String>(json, r'productId'),
        serviceJourney: mapValueOfType<String>(json, r'serviceJourney'),
        class_: ClassOfUse.fromJson(json[r'class']),
        berthTypes: BerthType.listFromJson(json[r'berthTypes']).toSet(),
      );
    }
    return null;
  }

  static List<ServiceFilter> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ServiceFilter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ServiceFilter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ServiceFilter> mapFromJson(dynamic json) {
    final map = <String, ServiceFilter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ServiceFilter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ServiceFilter-objects as value to a dart map
  static Map<String, List<ServiceFilter>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ServiceFilter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ServiceFilter.listFromJson(
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
