//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class SearchOfferInput {
  /// Returns a new [SearchOfferInput] instance.
  SearchOfferInput({
    required this.type,
    this.specification,
    this.filters = const [],
    this.pattern = const [],
    this.packageToExchange,
    this.travellers = const [],
    this.profiles = const [],
    this.travellingAssets = const [],
    this.entur,
  });

  String type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  TravelSpecification? specification;

  /// Request-wide predicates that every returned offer must satisfy.
  List<SearchOfferFilter> filters;

  List<TripPatternInner> pattern;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? packageToExchange;

  List<IndividualTraveller> travellers;

  List<UserProfile> profiles;

  List<TravellingAsset> travellingAssets;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  EnturSearchOfferInput? entur;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is SearchOfferInput &&
          other.type == type &&
          other.specification == specification &&
          _deepEquality.equals(other.filters, filters) &&
          _deepEquality.equals(other.pattern, pattern) &&
          other.packageToExchange == packageToExchange &&
          _deepEquality.equals(other.travellers, travellers) &&
          _deepEquality.equals(other.profiles, profiles) &&
          _deepEquality.equals(other.travellingAssets, travellingAssets) &&
          other.entur == entur;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (specification == null ? 0 : specification!.hashCode) +
      (filters.hashCode) +
      (pattern.hashCode) +
      (packageToExchange == null ? 0 : packageToExchange!.hashCode) +
      (travellers.hashCode) +
      (profiles.hashCode) +
      (travellingAssets.hashCode) +
      (entur == null ? 0 : entur!.hashCode);

  @override
  String toString() =>
      'SearchOfferInput[type=$type, specification=$specification, filters=$filters, pattern=$pattern, packageToExchange=$packageToExchange, travellers=$travellers, profiles=$profiles, travellingAssets=$travellingAssets, entur=$entur]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    if (this.specification != null) {
      json[r'specification'] = this.specification;
    } else {
      json[r'specification'] = null;
    }
    json[r'filters'] = this.filters;
    json[r'pattern'] = this.pattern;
    if (this.packageToExchange != null) {
      json[r'packageToExchange'] = this.packageToExchange;
    } else {
      json[r'packageToExchange'] = null;
    }
    json[r'travellers'] = this.travellers;
    json[r'profiles'] = this.profiles;
    json[r'travellingAssets'] = this.travellingAssets;
    if (this.entur != null) {
      json[r'entur'] = this.entur;
    } else {
      json[r'entur'] = null;
    }
    return json;
  }

  /// Returns a new [SearchOfferInput] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static SearchOfferInput? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "SearchOfferInput[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "SearchOfferInput[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return SearchOfferInput(
        type: mapValueOfType<String>(json, r'type')!,
        specification: TravelSpecification.fromJson(json[r'specification']),
        filters: SearchOfferFilter.listFromJson(json[r'filters']),
        pattern: TripPatternInner.listFromJson(json[r'pattern']),
        packageToExchange: mapValueOfType<String>(json, r'packageToExchange'),
        travellers: IndividualTraveller.listFromJson(json[r'travellers']),
        profiles: UserProfile.listFromJson(json[r'profiles']),
        travellingAssets:
            TravellingAsset.listFromJson(json[r'travellingAssets']),
        entur: EnturSearchOfferInput.fromJson(json[r'entur']),
      );
    }
    return null;
  }

  static List<SearchOfferInput> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <SearchOfferInput>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = SearchOfferInput.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, SearchOfferInput> mapFromJson(dynamic json) {
    final map = <String, SearchOfferInput>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = SearchOfferInput.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of SearchOfferInput-objects as value to a dart map
  static Map<String, List<SearchOfferInput>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<SearchOfferInput>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = SearchOfferInput.listFromJson(
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
