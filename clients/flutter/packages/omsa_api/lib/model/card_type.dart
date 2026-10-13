//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CardType {
  /// Returns a new [CardType] instance.
  CardType({
    required this.id,
    required this.type,
    this.cardCategory,
    this.subCategory,
    this.relatedProduct,
    this.transportOrganisations = const [],
    this.customFields = const {},
  });

  /// short string, display names (length 0-75)
  String id;

  String type;

  /// The category of card<br> DISCOUNT - discount card, can be applied in the purchase process to get rebate<br> TRAVEL - (external) travel card, possibly paid for in other context, but also monthly, weekly or day-cards<br> BANK - bank card<br> CREDIT - credit card<br> ID - identification card, like an ID card<br> PASSPORT - passport to identify yourself<br> OTHER - unspecified, use 'subCategory' to specify the category of card
  CardTypeCardCategoryEnum? cardCategory;

  /// short string, display names (length 0-75)
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? subCategory;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  ProductReference? relatedProduct;

  /// references to accepting parties, only if applicable
  List<OrganisationReference> transportOrganisations;

  /// dictionary for extra fields (bilatural agreements)
  Map<String, Object> customFields;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CardType &&
          other.id == id &&
          other.type == type &&
          other.cardCategory == cardCategory &&
          other.subCategory == subCategory &&
          other.relatedProduct == relatedProduct &&
          _deepEquality.equals(
              other.transportOrganisations, transportOrganisations) &&
          _deepEquality.equals(other.customFields, customFields);

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (id.hashCode) +
      (type.hashCode) +
      (cardCategory == null ? 0 : cardCategory!.hashCode) +
      (subCategory == null ? 0 : subCategory!.hashCode) +
      (relatedProduct == null ? 0 : relatedProduct!.hashCode) +
      (transportOrganisations.hashCode) +
      (customFields.hashCode);

  @override
  String toString() =>
      'CardType[id=$id, type=$type, cardCategory=$cardCategory, subCategory=$subCategory, relatedProduct=$relatedProduct, transportOrganisations=$transportOrganisations, customFields=$customFields]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'id'] = this.id;
    json[r'type'] = this.type;
    if (this.cardCategory != null) {
      json[r'cardCategory'] = this.cardCategory;
    } else {
      json[r'cardCategory'] = null;
    }
    if (this.subCategory != null) {
      json[r'subCategory'] = this.subCategory;
    } else {
      json[r'subCategory'] = null;
    }
    if (this.relatedProduct != null) {
      json[r'relatedProduct'] = this.relatedProduct;
    } else {
      json[r'relatedProduct'] = null;
    }
    json[r'transportOrganisations'] = this.transportOrganisations;
    json[r'customFields'] = this.customFields;
    return json;
  }

  /// Returns a new [CardType] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CardType? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key),
              'Required key "CardType[$key]" is missing from JSON.');
          assert(json[key] != null,
              'Required key "CardType[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return CardType(
        id: mapValueOfType<String>(json, r'id')!,
        type: mapValueOfType<String>(json, r'type')!,
        cardCategory: CardTypeCardCategoryEnum.fromJson(json[r'cardCategory']),
        subCategory: mapValueOfType<String>(json, r'subCategory'),
        relatedProduct: ProductReference.fromJson(json[r'relatedProduct']),
        transportOrganisations:
            OrganisationReference.listFromJson(json[r'transportOrganisations']),
        customFields:
            mapCastOfType<String, Object>(json, r'customFields') ?? const {},
      );
    }
    return null;
  }

  static List<CardType> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <CardType>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CardType.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CardType> mapFromJson(dynamic json) {
    final map = <String, CardType>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CardType.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CardType-objects as value to a dart map
  static Map<String, List<CardType>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<CardType>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CardType.listFromJson(
          entry.value,
          growable: growable,
        );
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'type',
  };
}

/// The category of card<br> DISCOUNT - discount card, can be applied in the purchase process to get rebate<br> TRAVEL - (external) travel card, possibly paid for in other context, but also monthly, weekly or day-cards<br> BANK - bank card<br> CREDIT - credit card<br> ID - identification card, like an ID card<br> PASSPORT - passport to identify yourself<br> OTHER - unspecified, use 'subCategory' to specify the category of card
class CardTypeCardCategoryEnum {
  /// Instantiate a new enum with the provided [value].
  const CardTypeCardCategoryEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const DISCOUNT = CardTypeCardCategoryEnum._(r'DISCOUNT');
  static const TRAVEL = CardTypeCardCategoryEnum._(r'TRAVEL');
  static const BANK = CardTypeCardCategoryEnum._(r'BANK');
  static const CREDIT = CardTypeCardCategoryEnum._(r'CREDIT');
  static const ID = CardTypeCardCategoryEnum._(r'ID');
  static const PASSPORT = CardTypeCardCategoryEnum._(r'PASSPORT');
  static const OTHER = CardTypeCardCategoryEnum._(r'OTHER');

  /// List of all possible values in this [enum][CardTypeCardCategoryEnum].
  static const values = <CardTypeCardCategoryEnum>[
    DISCOUNT,
    TRAVEL,
    BANK,
    CREDIT,
    ID,
    PASSPORT,
    OTHER,
  ];

  static CardTypeCardCategoryEnum? fromJson(dynamic value) =>
      CardTypeCardCategoryEnumTypeTransformer().decode(value);

  static List<CardTypeCardCategoryEnum> listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <CardTypeCardCategoryEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CardTypeCardCategoryEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [CardTypeCardCategoryEnum] to String,
/// and [decode] dynamic data back to [CardTypeCardCategoryEnum].
class CardTypeCardCategoryEnumTypeTransformer {
  factory CardTypeCardCategoryEnumTypeTransformer() =>
      _instance ??= const CardTypeCardCategoryEnumTypeTransformer._();

  const CardTypeCardCategoryEnumTypeTransformer._();

  String encode(CardTypeCardCategoryEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a CardTypeCardCategoryEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  CardTypeCardCategoryEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'DISCOUNT':
          return CardTypeCardCategoryEnum.DISCOUNT;
        case r'TRAVEL':
          return CardTypeCardCategoryEnum.TRAVEL;
        case r'BANK':
          return CardTypeCardCategoryEnum.BANK;
        case r'CREDIT':
          return CardTypeCardCategoryEnum.CREDIT;
        case r'ID':
          return CardTypeCardCategoryEnum.ID;
        case r'PASSPORT':
          return CardTypeCardCategoryEnum.PASSPORT;
        case r'OTHER':
          return CardTypeCardCategoryEnum.OTHER;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [CardTypeCardCategoryEnumTypeTransformer] instance.
  static CardTypeCardCategoryEnumTypeTransformer? _instance;
}
