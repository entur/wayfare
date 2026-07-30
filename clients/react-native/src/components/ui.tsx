import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type ViewStyle,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "@/settings/context";
import { TurtleMagnifyingGlass, WayfareCombinedHeader } from "./brand";

export function Screen({
  title,
  subtitle,
  children,
  refreshing,
  onRefresh,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: (() => void) | undefined;
  footer?: React.ReactNode;
}) {
  const { theme } = useSettings();
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing ?? false}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          ) : undefined
        }
      >
        <WayfareWordmark />
        <View style={styles.heading}>
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: theme.colors.text }]}
            maxFontSizeMultiplier={1.8}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[styles.subtitle, { color: theme.colors.textSecondary }]}
              maxFontSizeMultiplier={1.8}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        {children}
      </ScrollView>
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.colors.background,
              borderTopColor: theme.colors.line,
            },
          ]}
        >
          <View style={styles.footerContent}>{footer}</View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export function WayfareWordmark() {
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Wayfare"
      style={styles.wordmark}
    >
      <WayfareCombinedHeader />
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { theme } = useSettings();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.line,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Heading({ children }: { children: React.ReactNode }) {
  const { theme } = useSettings();
  return (
    <Text
      accessibilityRole="header"
      style={[styles.cardTitle, { color: theme.colors.text }]}
      maxFontSizeMultiplier={1.8}
    >
      {children}
    </Text>
  );
}

export function Body({
  children,
  secondary = false,
}: {
  children: React.ReactNode;
  secondary?: boolean;
}) {
  const { theme } = useSettings();
  return (
    <Text
      style={[
        styles.body,
        {
          color: secondary ? theme.colors.textSecondary : theme.colors.text,
        },
      ]}
      maxFontSizeMultiplier={2}
    >
      {children}
    </Text>
  );
}

export function Button({
  label,
  onPress,
  disabled = false,
  pending = false,
  variant = "primary",
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  pending?: boolean;
  variant?: "primary" | "secondary";
  accessibilityHint?: string;
}) {
  const { theme } = useSettings();
  const primary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={pending ? `${label}, in progress` : label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || pending, busy: pending }}
      disabled={disabled || pending}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          opacity: disabled || pending ? 0.5 : 1,
          backgroundColor: primary
            ? pressed
              ? theme.colors.primaryPressed
              : theme.colors.primary
            : "transparent",
          borderColor: theme.colors.line,
        },
      ]}
    >
      {pending ? (
        <ActivityIndicator color={primary ? "#FFFFFF" : theme.colors.primary} />
      ) : null}
      <Text
        style={[
          styles.buttonLabel,
          {
            color: primary ? "#FFFFFF" : theme.colors.text,
          },
        ]}
        maxFontSizeMultiplier={1.6}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function FormField({
  label,
  hint,
  ...props
}: TextInputProps & { label: string; hint?: string }) {
  const { theme } = useSettings();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={hint}
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.line,
            color: theme.colors.text,
          },
        ]}
        {...props}
      />
      {hint ? (
        <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export function Banner({
  kind,
  title,
  message,
  action,
}: {
  kind: "info" | "warning" | "error";
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  const { theme } = useSettings();
  const colors =
    kind === "info"
      ? {
          background: theme.colors.infoBackground,
          border: theme.colors.infoBorder,
          text: theme.colors.infoText,
        }
      : kind === "warning"
        ? {
            background: theme.colors.warningBackground,
            border: theme.colors.warningBorder,
            text: theme.colors.warningText,
          }
        : {
            background: theme.colors.errorBackground,
            border: theme.colors.errorBorder,
            text: theme.colors.errorText,
          };
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        {
          backgroundColor: colors.background,
          borderLeftColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.bannerTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.bannerMessage, { color: colors.text }]}>
        {message}
      </Text>
      {action}
    </View>
  );
}

export function LoadingState({ label }: { label: string }) {
  const { theme } = useSettings();
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      style={styles.center}
    >
      <ActivityIndicator color={theme.colors.primary} size="large" />
      <Body secondary>{label}</Body>
    </View>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Card style={styles.centerCard}>
      <TurtleMagnifyingGlass />
      <Heading>{title}</Heading>
      <Body secondary>{message}</Body>
    </Card>
  );
}

export function Divider() {
  const { theme } = useSettings();
  return (
    <View style={[styles.divider, { backgroundColor: theme.colors.line }]} />
  );
}

export function ConfirmationSheet({
  visible,
  title,
  message,
  confirmLabel,
  pending = false,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { theme } = useSettings();
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close confirmation"
        onPress={onCancel}
        style={styles.scrim}
      >
        <Pressable
          accessibilityViewIsModal
          onPress={(event) => event.stopPropagation()}
          style={[styles.sheet, { backgroundColor: theme.colors.surface }]}
        >
          <Heading>{title}</Heading>
          <Body secondary>{message}</Body>
          <View style={styles.sheetActions}>
            <Button
              label="Cancel"
              onPress={onCancel}
              disabled={pending}
              variant="secondary"
            />
            <Button
              label={confirmLabel}
              onPress={onConfirm}
              pending={pending}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  screen: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerContent: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
  },
  heading: { gap: 4, marginBottom: 4 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: "700" },
  subtitle: { fontSize: 15, lineHeight: 22 },
  wordmark: { alignItems: "flex-start", height: 43 },
  card: { borderWidth: 1, borderRadius: 16, padding: 18, gap: 12 },
  cardTitle: { fontSize: 18, lineHeight: 24, fontWeight: "700" },
  body: { fontSize: 15, lineHeight: 22 },
  button: {
    minHeight: 48,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonLabel: { fontSize: 15, fontWeight: "700" },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600" },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 16,
  },
  hint: { fontSize: 12, lineHeight: 17 },
  banner: {
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  bannerTitle: { fontSize: 15, fontWeight: "700" },
  bannerMessage: { fontSize: 14, lineHeight: 20 },
  center: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  centerCard: { alignItems: "center", paddingVertical: 30 },
  divider: { height: StyleSheet.hairlineWidth, width: "100%" },
  scrim: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    padding: 24,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
  },
  sheetActions: { gap: 10, marginTop: 8 },
});
