//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ProductReference {
  /// Returns a new [ProductReference] instance.
  ProductReference({
    required this.productId,
    required this.name,
  });

  /// default string, full names etc (length 0-200)
  String productId;

  /// default string, full names etc (length 0-200)
  String name;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ProductReference &&
          other.productId == productId &&
          other.name == name;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (productId.hashCode) + (name.hashCode);

  @override
  String toString() => 'ProductReference[productId=$productId, name=$name]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'productId'] = this.productId;
    json[r'name'] = this.name;
    return json;
  }

  /// Returns a new [ProductReference] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProductReference? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "ProductReference[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "ProductReference[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ProductReference(
        productId: mapValueOfType<String>(json, r'productId')!,
        name: mapValueOfType<String>(json, r'name')!,
      );
    }
    return null;
  }

  static List<ProductReference> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <ProductReference>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProductReference.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProductReference> mapFromJson(dynamic json) {
    final map = <String, ProductReference>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProductReference.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProductReference-objects as value to a dart map
  static Map<String, List<ProductReference>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<ProductReference>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProductReference.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'productId',
    'name',
  };
}
