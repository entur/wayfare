//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CustomerCollection {
  /// Returns a new [CustomerCollection] instance.
  CustomerCollection({
    required this.type,
    this.customers = const [],
    this.numberMatched,
    this.numberReturned,
    this.links = const [],
  });

  CustomerCollectionTypeEnum type;

  List<Customer> customers;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? numberMatched;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? numberReturned;

  /// actions that can be performed on this package, but also alternative (rel=alternative+1, alternative+2) offers or references to other resources In case it is an alternative, specify clearly in the description what the financial consequences are.
  List<Link> links;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CustomerCollection &&
          other.type == type &&
          _deepEquality.equals(other.customers, customers) &&
          other.numberMatched == numberMatched &&
          other.numberReturned == numberReturned &&
          _deepEquality.equals(other.links, links);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (customers.hashCode) +
      (numberMatched == null ? 0 : numberMatched!.hashCode) +
      (numberReturned == null ? 0 : numberReturned!.hashCode) +
      (links.hashCode);

  @override
  String toString() =>
      'CustomerCollection[type=$type, customers=$customers, numberMatched=$numberMatched, numberReturned=$numberReturned, links=$links]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'customers'] = this.customers;
    if (this.numberMatched != null) {
      json[r'numberMatched'] = this.numberMatched;
    } else {
      json[r'numberMatched'] = null;
    }
    if (this.numberReturned != null) {
      json[r'numberReturned'] = this.numberReturned;
    } else {
      json[r'numberReturned'] = null;
    }
    json[r'links'] = this.links;
    return json;
  }

  /// Returns a new [CustomerCollection] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CustomerCollection? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "CustomerCollection[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "CustomerCollection[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CustomerCollection(
        type: CustomerCollectionTypeEnum.fromJson(json[r'type'])!,
        customers: Customer.listFromJson(json[r'customers']),
        numberMatched: mapValueOfType<int>(json, r'numberMatched'),
        numberReturned: mapValueOfType<int>(json, r'numberReturned'),
        links: Link.listFromJson(json[r'links']),
      );
    }
    return null;
  }

  static List<CustomerCollection> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <CustomerCollection>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CustomerCollection.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CustomerCollection> mapFromJson(dynamic json) {
    final map = <String, CustomerCollection>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CustomerCollection.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CustomerCollection-objects as value to a dart map
  static Map<String, List<CustomerCollection>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<CustomerCollection>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CustomerCollection.listFromJson(
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

class CustomerCollectionTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const CustomerCollectionTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const customerCollection =
      CustomerCollectionTypeEnum._(r'CustomerCollection');

  /// List of all possible values in this [enum][CustomerCollectionTypeEnum].
  static const values = <CustomerCollectionTypeEnum>[
    customerCollection,
  ];

  static CustomerCollectionTypeEnum? fromJson(dynamic value) =>
      CustomerCollectionTypeEnumTypeTransformer().decode(value);

  static List<CustomerCollectionTypeEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <CustomerCollectionTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CustomerCollectionTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [CustomerCollectionTypeEnum] to String,
/// and [decode] dynamic data back to [CustomerCollectionTypeEnum].
class CustomerCollectionTypeEnumTypeTransformer {
  factory CustomerCollectionTypeEnumTypeTransformer() =>
      _instance ??= const CustomerCollectionTypeEnumTypeTransformer._();

  const CustomerCollectionTypeEnumTypeTransformer._();

  String encode(CustomerCollectionTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a CustomerCollectionTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  CustomerCollectionTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'CustomerCollection':
          return CustomerCollectionTypeEnum.customerCollection;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [CustomerCollectionTypeEnumTypeTransformer] instance.
  static CustomerCollectionTypeEnumTypeTransformer? _instance;
}
