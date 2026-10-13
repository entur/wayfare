//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class Product {
  /// Returns a new [Product] instance.
  Product({
    this.type,
    this.productId,
    this.productName,
    this.guarantees = const [],
    this.service = const [],
    this.reservationRequirements = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  ProductReference? productId;

  /// default string, full names etc (length 0-200)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? productName;

  /// references to products that are contained in this product (to facilitate e.g. travel through) If his combined product is named in a package, the referenced packages must be enlisted as well.
  List<Guarantee> guarantees;

  /// Service characteristics covered by this product, such as service journey, class of use, asset, or accommodation.
  List<ServiceParameter> service;

  /// Reservation rules carried by this product.
  List<ReservationRequirement> reservationRequirements;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Product &&
          other.type == type &&
          other.productId == productId &&
          other.productName == productName &&
          _deepEquality.equals(other.guarantees, guarantees) &&
          _deepEquality.equals(other.service, service) &&
          _deepEquality.equals(
              other.reservationRequirements, reservationRequirements);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type == null ? 0 : type!.hashCode) +
      (productId == null ? 0 : productId!.hashCode) +
      (productName == null ? 0 : productName!.hashCode) +
      (guarantees.hashCode) +
      (service.hashCode) +
      (reservationRequirements.hashCode);

  @override
  String toString() =>
      'Product[type=$type, productId=$productId, productName=$productName, guarantees=$guarantees, service=$service, reservationRequirements=$reservationRequirements]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.productId != null) {
      json[r'productId'] = this.productId;
    } else {
      json[r'productId'] = null;
    }
    if (this.productName != null) {
      json[r'productName'] = this.productName;
    } else {
      json[r'productName'] = null;
    }
    json[r'guarantees'] = this.guarantees;
    json[r'service'] = this.service;
    json[r'reservationRequirements'] = this.reservationRequirements;
    return json;
  }

  /// Returns a new [Product] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Product? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "Product[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "Product[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Product(
        type: mapValueOfType<String>(json, r'type'),
        productId: ProductReference.fromJson(json[r'productId']),
        productName: mapValueOfType<String>(json, r'productName'),
        guarantees: Guarantee.listFromJson(json[r'guarantees']),
        service: ServiceParameter.listFromJson(json[r'service']),
        reservationRequirements: ReservationRequirement.listFromJson(
            json[r'reservationRequirements']),
      );
    }
    return null;
  }

  static List<Product> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <Product>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Product.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Product> mapFromJson(dynamic json) {
    final map = <String, Product>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Product.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Product-objects as value to a dart map
  static Map<String, List<Product>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<Product>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Product.listFromJson(
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
