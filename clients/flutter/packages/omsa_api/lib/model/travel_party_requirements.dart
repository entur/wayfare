//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TravelPartyRequirements {
  /// Returns a new [TravelPartyRequirements] instance.
  TravelPartyRequirements({
    this.organisational = const [],
    this.spotReservations = const [],
    this.distribution = const [],
    this.network = const [],
    this.routing = const [],
    this.service = const [],
    this.temporal = const [],
    this.equipment = const [],
    this.cancellation = const [],
    this.purchase = const [],
  });

  List<OrganisationalParameter> organisational;

  List<SpotReservationParameter> spotReservations;

  List<DistributionParameter> distribution;

  List<NetworkParameter> network;

  List<RoutingParameter> routing;

  List<ServiceParameter> service;

  List<TemporalParameter> temporal;

  List<EquipmentParameter> equipment;

  List<CancellationParameter> cancellation;

  List<PurchaseParameter> purchase;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TravelPartyRequirements &&
          _deepEquality.equals(other.organisational, organisational) &&
          _deepEquality.equals(other.spotReservations, spotReservations) &&
          _deepEquality.equals(other.distribution, distribution) &&
          _deepEquality.equals(other.network, network) &&
          _deepEquality.equals(other.routing, routing) &&
          _deepEquality.equals(other.service, service) &&
          _deepEquality.equals(other.temporal, temporal) &&
          _deepEquality.equals(other.equipment, equipment) &&
          _deepEquality.equals(other.cancellation, cancellation) &&
          _deepEquality.equals(other.purchase, purchase);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (organisational.hashCode) +
      (spotReservations.hashCode) +
      (distribution.hashCode) +
      (network.hashCode) +
      (routing.hashCode) +
      (service.hashCode) +
      (temporal.hashCode) +
      (equipment.hashCode) +
      (cancellation.hashCode) +
      (purchase.hashCode);

  @override
  String toString() =>
      'TravelPartyRequirements[organisational=$organisational, spotReservations=$spotReservations, distribution=$distribution, network=$network, routing=$routing, service=$service, temporal=$temporal, equipment=$equipment, cancellation=$cancellation, purchase=$purchase]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'organisational'] = this.organisational;
    json[r'spotReservations'] = this.spotReservations;
    json[r'distribution'] = this.distribution;
    json[r'network'] = this.network;
    json[r'routing'] = this.routing;
    json[r'service'] = this.service;
    json[r'temporal'] = this.temporal;
    json[r'equipment'] = this.equipment;
    json[r'cancellation'] = this.cancellation;
    json[r'purchase'] = this.purchase;
    return json;
  }

  /// Returns a new [TravelPartyRequirements] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TravelPartyRequirements? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "TravelPartyRequirements[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "TravelPartyRequirements[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TravelPartyRequirements(
        organisational:
            OrganisationalParameter.listFromJson(json[r'organisational']),
        spotReservations:
            SpotReservationParameter.listFromJson(json[r'spotReservations']),
        distribution: DistributionParameter.listFromJson(json[r'distribution']),
        network: NetworkParameter.listFromJson(json[r'network']),
        routing: RoutingParameter.listFromJson(json[r'routing']),
        service: ServiceParameter.listFromJson(json[r'service']),
        temporal: TemporalParameter.listFromJson(json[r'temporal']),
        equipment: EquipmentParameter.listFromJson(json[r'equipment']),
        cancellation: CancellationParameter.listFromJson(json[r'cancellation']),
        purchase: PurchaseParameter.listFromJson(json[r'purchase']),
      );
    }
    return null;
  }

  static List<TravelPartyRequirements> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <TravelPartyRequirements>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TravelPartyRequirements.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TravelPartyRequirements> mapFromJson(dynamic json) {
    final map = <String, TravelPartyRequirements>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TravelPartyRequirements.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TravelPartyRequirements-objects as value to a dart map
  static Map<String, List<TravelPartyRequirements>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<TravelPartyRequirements>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TravelPartyRequirements.listFromJson(
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
