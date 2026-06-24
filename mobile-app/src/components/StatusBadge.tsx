import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type StatusBadgeStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed"
  | "unpaid"
  | "paid"
  | "refunded";

interface StatusBadgeProps {
  status: StatusBadgeStatus;
}

const statusStyles: Record<StatusBadgeStatus, { label: string; bg: string; text: string }> = {
  pending: { label: "Pending", bg: colors.softOrange, text: colors.warning },
  approved: { label: "Approved", bg: colors.softBlue, text: colors.info },
  rejected: { label: "Rejected", bg: colors.softRed, text: colors.danger },
  cancelled: { label: "Cancelled", bg: colors.softGray, text: colors.muted },
  completed: { label: "Completed", bg: colors.softGreen, text: colors.success },
  unpaid: { label: "Unpaid", bg: colors.softOrange, text: colors.warning },
  paid: { label: "Paid", bg: colors.softGreen, text: colors.success },
  refunded: { label: "Refunded", bg: colors.softGray, text: colors.muted }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const badge = statusStyles[status];

  return (
    <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.text }]}>
      <Text style={[styles.text, { color: badge.text }]}>{badge.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6
  },
  text: {
    fontSize: 12,
    fontWeight: "900"
  }
});
