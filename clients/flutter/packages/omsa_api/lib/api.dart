//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

library openapi.api;

import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:collection/collection.dart';
import 'package:http/http.dart';
import 'package:intl/intl.dart';
import 'package:meta/meta.dart';

part 'api_client.dart';
part 'api_helper.dart';
part 'api_exception.dart';
part 'auth/authentication.dart';
part 'auth/api_key_auth.dart';
part 'auth/oauth.dart';
part 'auth/http_basic_auth.dart';
part 'auth/http_bearer_auth.dart';

part 'api/authentication_api.dart';
part 'api/collections_api.dart';
part 'api/discovery_api.dart';
part 'api/processes_api.dart';

part 'model/accommodation.dart';
part 'model/activation_means.dart';
part 'model/add_traveller_handler_request.dart';
part 'model/add_traveller_input.dart';
part 'model/amount_of_money.dart';
part 'model/ancillary.dart';
part 'model/ancillary_collection.dart';
part 'model/ancillary_collection_ancillaries_inner.dart';
part 'model/ancillary_input.dart';
part 'model/ancillary_reference.dart';
part 'model/asset.dart';
part 'model/asset_input.dart';
part 'model/asset_selection.dart';
part 'model/assign_ancillary_process_handler_request.dart';
part 'model/assign_asset_handler_request.dart';
part 'model/berth_type.dart';
part 'model/binary_ticket.dart';
part 'model/blackout_use.dart';
part 'model/cancellation_parameter.dart';
part 'model/card.dart';
part 'model/card_type.dart';
part 'model/change_option.dart';
part 'model/change_option_collection.dart';
part 'model/change_option_collection_options_inner.dart';
part 'model/claim_refund_process_handler_request.dart';
part 'model/class_of_use.dart';
part 'model/collection_info.dart';
part 'model/collections.dart';
part 'model/commercial_profile.dart';
part 'model/conf_classes.dart';
part 'model/customer.dart';
part 'model/customer_collection.dart';
part 'model/customer_input.dart';
part 'model/customer_ref.dart';
part 'model/data_type.dart';
part 'model/day.dart';
part 'model/description_type.dart';
part 'model/distribution_parameter.dart';
part 'model/entitlement_given.dart';
part 'model/entur_recommendation_control.dart';
part 'model/entur_recommendation_type.dart';
part 'model/entur_search_offer_input.dart';
part 'model/equipment_parameter.dart';
part 'model/equipment_reference.dart';
part 'model/error.dart';
part 'model/extend_expiry_time_input.dart';
part 'model/extend_expiry_time_process_handler_request.dart';
part 'model/external_ticket.dart';
part 'model/financial_detail.dart';
part 'model/frequency_of_use.dart';
part 'model/frequency_of_use_type.dart';
part 'model/geojson.dart';
part 'model/geojson_crs.dart';
part 'model/geojson_crs_properties.dart';
part 'model/geojson_feature.dart';
part 'model/geojson_feature_geometry.dart';
part 'model/geojson_feature_properties.dart';
part 'model/geojson_line.dart';
part 'model/geojson_multi_polygon.dart';
part 'model/geojson_point.dart';
part 'model/geojson_polygon.dart';
part 'model/guarantee.dart';
part 'model/individual_traveller.dart';
part 'model/job_control_options.dart';
part 'model/landing_page.dart';
part 'model/leg.dart';
part 'model/leg_input.dart';
part 'model/leg_state.dart';
part 'model/license.dart';
part 'model/license_type.dart';
part 'model/link.dart';
part 'model/metadata.dart';
part 'model/metadata_one_of.dart';
part 'model/metadata_one_of1.dart';
part 'model/metadata_one_of1_value.dart';
part 'model/mode.dart';
part 'model/network_parameter.dart';
part 'model/oauth_token_post200_response.dart';
part 'model/offer.dart';
part 'model/offer_collection.dart';
part 'model/offer_properties.dart';
part 'model/onboard_stay.dart';
part 'model/organisation_reference.dart';
part 'model/organisational_filter.dart';
part 'model/organisational_parameter.dart';
part 'model/package.dart';
part 'model/package_all_of_travellers.dart';
part 'model/package_collection.dart';
part 'model/package_input.dart';
part 'model/package_status.dart';
part 'model/payment_category.dart';
part 'model/pending_ticket.dart';
part 'model/place_definitions.dart';
part 'model/place_reference.dart';
part 'model/postal_address.dart';
part 'model/process_list.dart';
part 'model/process_summary.dart';
part 'model/product.dart';
part 'model/product_reference.dart';
part 'model/purchase_offers_input.dart';
part 'model/purchase_offers_process_handler_request.dart';
part 'model/purchase_package_process_handler_request.dart';
part 'model/purchase_parameter.dart';
part 'model/refund_option.dart';
part 'model/refund_option_collection.dart';
part 'model/refund_option_collection_options_inner.dart';
part 'model/refund_option_input.dart';
part 'model/remove_traveller_handler_request.dart';
part 'model/remove_traveller_input.dart';
part 'model/reservation_policy.dart';
part 'model/reservation_requirement.dart';
part 'model/routing_parameter.dart';
part 'model/search_offer_filter.dart';
part 'model/search_offer_handler_request.dart';
part 'model/search_offer_input.dart';
part 'model/seat.dart';
part 'model/select_offers_handler_request.dart';
part 'model/select_offers_input.dart';
part 'model/service_filter.dart';
part 'model/service_parameter.dart';
part 'model/spot_reservation_parameter.dart';
part 'model/subscriber.dart';
part 'model/temporal_parameter.dart';
part 'model/travel_document.dart';
part 'model/travel_document_collection.dart';
part 'model/travel_document_collection_travel_documents_inner.dart';
part 'model/travel_document_collection_travel_documents_inner_properties.dart';
part 'model/travel_document_format.dart';
part 'model/travel_document_status.dart';
part 'model/travel_party.dart';
part 'model/travel_party_entitlements.dart';
part 'model/travel_party_requirements.dart';
part 'model/travel_specification.dart';
part 'model/travelling_asset.dart';
part 'model/trip_pattern_inner.dart';
part 'model/update_travel_document_validity_input.dart';
part 'model/update_travel_document_validity_process_handler_request.dart';
part 'model/update_travel_document_validity_response.dart';
part 'model/update_traveller_handler_request.dart';
part 'model/update_traveller_input.dart';
part 'model/usage_end.dart';
part 'model/usage_start_constraint_type.dart';
part 'model/usage_trigger.dart';
part 'model/usage_validity_period.dart';
part 'model/usage_validity_period_type.dart';
part 'model/user_need_reference.dart';
part 'model/user_profile.dart';
part 'model/zone_reference.dart';

/// An [ApiClient] instance that uses the default values obtained from
/// the OpenAPI specification file.
var defaultApiClient = ApiClient();

const _delimiters = {'csv': ',', 'ssv': ' ', 'tsv': '\t', 'pipes': '|'};
const _dateEpochMarker = 'epoch';
const _deepEquality = DeepCollectionEquality();
final _dateFormatter = DateFormat('yyyy-MM-dd');
final _regList = RegExp(r'^List<(.*)>$');
final _regSet = RegExp(r'^Set<(.*)>$');
final _regMap = RegExp(r'^Map<String,(.*)>$');

bool _isEpochMarker(String? pattern) =>
    pattern == _dateEpochMarker || pattern == '/$_dateEpochMarker/';
