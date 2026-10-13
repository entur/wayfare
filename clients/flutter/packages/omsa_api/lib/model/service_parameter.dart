//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ServiceParameter {
  /// Returns a new [ServiceParameter] instance.
  ServiceParameter({
    required this.type,
    this.product,
    this.asset,
    this.serviceJourney,
    this.userNeeds = const [],
    this.class_,
    this.onboardStay = const [],
    this.accommodations = const [],
  });

  String type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  ProductReference? product;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? asset;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? serviceJourney;

  List<UserNeedReference> userNeeds;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  ClassOfUse? class_;

  List<OnboardStay> onboardStay;

  List<Accommodation> accommodations;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ServiceParameter &&
          other.type == type &&
          other.product == product &&
          other.asset == asset &&
          other.serviceJourney == serviceJourney &&
          _deepEquality.equals(other.userNeeds, userNeeds) &&
          other.class_ == class_ &&
          _deepEquality.equals(other.onboardStay, onboardStay) &&
          _deepEquality.equals(other.accommodations, accommodations);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (product == null ? 0 : product!.hashCode) +
      (asset == null ? 0 : asset!.hashCode) +
      (serviceJourney == null ? 0 : serviceJourney!.hashCode) +
      (userNeeds.hashCode) +
      (class_ == null ? 0 : class_!.hashCode) +
      (onboardStay.hashCode) +
      (accommodations.hashCode);

  @override
  String toString() =>
      'ServiceParameter[type=$type, product=$product, asset=$asset, serviceJourney=$serviceJourney, userNeeds=$userNeeds, class_=$class_, onboardStay=$onboardStay, accommodations=$accommodations]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.product != null) {
      json[r'product'] = this.product;
    } else {
      json[r'product'] = null;
    }
    if (this.asset != null) {
      json[r'asset'] = this.asset;
    } else {
      json[r'asset'] = null;
    }
    if (this.serviceJourney != null) {
      json[r'serviceJourney'] = this.serviceJourney;
    } else {
      json[r'serviceJourney'] = null;
    }
    json[r'userNeeds'] = this.userNeeds;
    if (this.class_ != null) {
      json[r'class'] = this.class_;
    } else {
      json[r'class'] = null;
    }
    json[r'onboardStay'] = this.onboardStay;
    json[r'accommodations'] = this.accommodations;
    return json;
  }

  /// Returns a new [ServiceParameter] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ServiceParameter? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ServiceParameter[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ServiceParameter[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ServiceParameter(
        type: mapValueOfType<String>(json, r'type')!,
        product: ProductReference.fromJson(json[r'product']),
        asset: mapValueOfType<String>(json, r'asset'),
        serviceJourney: mapValueOfType<String>(json, r'serviceJourney'),
        userNeeds: UserNeedReference.listFromJson(json[r'userNeeds']),
        class_: ClassOfUse.fromJson(json[r'class']),
        onboardStay: OnboardStay.listFromJson(json[r'onboardStay']),
        accommodations: Accommodation.listFromJson(json[r'accommodations']),
      );
    }
    return null;
  }

  static List<ServiceParameter> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ServiceParameter>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ServiceParameter.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ServiceParameter> mapFromJson(dynamic json) {
    final map = <String, ServiceParameter>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ServiceParameter.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ServiceParameter-objects as value to a dart map
  static Map<String, List<ServiceParameter>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ServiceParameter>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ServiceParameter.listFromJson(
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
