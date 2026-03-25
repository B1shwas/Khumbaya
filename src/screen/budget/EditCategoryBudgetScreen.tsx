import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
 
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/src/components/ui/Text";
interface PaymentRecord {
  id: string;
  label: string;
  date: string;
  method: string;
  amount: number;
  status: "Verified" | "Pending";
}

const PAYMENT_METHODS = ["Bank Transfer", "Credit Card", "Cash"];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: "p1",
    label: "Deposit Payment",
    date: "Oct 12, 2023",
    method: "Bank Transfer",
    amount: 500,
    status: "Verified",
  },
  {
    id: "p2",
    label: "Second Installment",
    date: "Jan 05, 2024",
    method: "Bank Transfer",
    amount: 700,
    status: "Verified",
  },
];

const fmt = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

/** Labelled field wrapper */
function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1 mb-1.5">
      {children}
    </Text>
  );
}

/** Plain text input */
function StyledInput({
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad";
}) {
  return (
    <TextInput
      className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-semibold text-[#181114]"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      keyboardType={keyboardType ?? "default"}
    />
  );
}

/** Dollar-prefixed amount input */
function AmountInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4">
      <Text className="text-[#ee2b8c] font-bold text-sm mr-1">$</Text>
      <TextInput
        className="flex-1 py-4 text-sm font-bold text-[#181114]"
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}

/** Payment method picker (modal-based) */
function PaymentMethodPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4"
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text className="flex-1 text-sm font-semibold text-[#181114]">
          {value}
        </Text>
        <MaterialIcons name="expand-more" size={20} color="#594048" />
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade">
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setOpen(false)}
        >
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
            <Text className="text-base font-extrabold text-[#181114] mb-4">
              Payment Method
            </Text>
            {PAYMENT_METHODS.map((m) => (
              <TouchableOpacity
                key={m}
                className={`py-4 border-b border-gray-100 flex-row items-center justify-between`}
                onPress={() => {
                  onChange(m);
                  setOpen(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm font-semibold ${
                    m === value ? "text-[#ee2b8c]" : "text-[#181114]"
                  }`}
                >
                  {m}
                </Text>
                {m === value && (
                  <MaterialIcons name="check" size={18} color="#ee2b8c" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

/** Single payment history row */
function PaymentRow({ item }: { item: PaymentRecord }) {
  return (
    <View className="flex-row items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 mb-3">
      <View className="flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center">
          <MaterialIcons name="receipt-long" size={22} color="#594048" />
        </View>
        <View>
          <Text className="font-bold text-sm text-[#181114]">{item.label}</Text>
          <Text className="text-[11px] text-gray-400 font-medium mt-0.5">
            {item.date} • {item.method}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="font-extrabold text-sm text-[#ee2b8c]">
          {fmt(item.amount)}
        </Text>
        <Text
          className={`text-[10px] font-extrabold uppercase tracking-tight mt-0.5 ${
            item.status === "Verified" ? "text-emerald-600" : "text-amber-500"
          }`}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );
}

/** Sticky remaining balance footer */
function RemainingBalanceBar({ remaining }: { remaining: number }) {
  return (
    <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white/95">
      <View className="flex-row items-center justify-between bg-[#ee2b8c]/5 border border-[#ee2b8c]/10 px-5 py-4 rounded-3xl">
        <View>
          <Text className="text-[10px] font-extrabold uppercase tracking-widest text-[#ee2b8c]/70 mb-1">
            Remaining Balance
          </Text>
          <Text className="text-3xl font-extrabold tracking-tighter text-[#181114]">
            {fmt(remaining)}
          </Text>
        </View>
        <View className="w-12 h-12 rounded-full bg-[#ee2b8c]/10 items-center justify-center">
          <MaterialIcons
            name="account-balance-wallet"
            size={22}
            color="#ee2b8c"
          />
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function EditCategoryBudgetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();

  // Parse category data from params
  const categoryData = params.category ? JSON.parse(params.category) : null;

  // Calculate totals from items
  const calculateTotals = (items: { estimated: number; actual: number }[]) => {
    const estimated = items.reduce(
      (sum, item) => sum + (item.estimated || 0),
      0
    );
    const actual = items.reduce((sum, item) => sum + (item.actual || 0), 0);
    return { estimated, actual };
  };

  const { estimated: categoryEstimated, actual: categoryActual } =
    categoryData?.items
      ? calculateTotals(categoryData.items)
      : { estimated: 0, actual: 0 };

  // Form state - use dynamic data if available, otherwise defaults
  const [categoryName, setCategoryName] = useState(
    categoryData?.label || "Photography"
  );
  const [estimated, setEstimated] = useState(
    categoryEstimated > 0 ? categoryEstimated.toString() : "3500"
  );
  const [actualSpent, setActualSpent] = useState(
    categoryActual > 0 ? categoryActual.toString() : "1200"
  );
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [dueDate, setDueDate] = useState("08/15/2024");
  const [notes, setNotes] = useState(
    "Contract includes 8 hours of coverage and physical album. Final payment due 2 weeks before wedding."
  );
  const [payments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);

  const estimatedNum = parseFloat(estimated) || 0;
  const spentNum = parseFloat(actualSpent) || 0;
  const remaining = Math.max(0, estimatedNum - spentNum);

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log({
      categoryName,
      estimated,
      actualSpent,
      paymentMethod,
      dueDate,
      notes,
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#fdfbfc]">
      <StatusBar barStyle="dark-content" backgroundColor="#fdfbfc" />

      {/* ── Scrollable Body ── */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-6 pb-52"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Financial Details ── */}
        <Text className="text-xl font-extrabold tracking-tight text-[#181114] mb-4">
          Financial Details
        </Text>

        <View className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 space-y-5 mb-8">
          {/* Category Name */}
          <View>
            <FieldLabel>Category Name</FieldLabel>
            <StyledInput value={categoryName} onChangeText={setCategoryName} />
          </View>

          {/* Estimated + Actual row */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <FieldLabel>Estimated Budget</FieldLabel>
              <AmountInput value={estimated} onChangeText={setEstimated} />
            </View>
            <View className="flex-1">
              <FieldLabel>Actual Spent</FieldLabel>
              <AmountInput value={actualSpent} onChangeText={setActualSpent} />
            </View>
          </View>

          {/* Payment Method + Due Date row */}
          <View className="flex-row gap-4">
            <View className="flex-1">
              <FieldLabel>Payment Method</FieldLabel>
              <PaymentMethodPicker
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </View>
            <View className="flex-1">
              <FieldLabel>Next Due Date</FieldLabel>
              <View className="flex-row items-center bg-gray-50 rounded-2xl px-4">
                <TextInput
                  className="flex-1 py-4 text-sm font-semibold text-[#181114]"
                  value={dueDate}
                  onChangeText={setDueDate}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="#9ca3af"
                />
                <MaterialIcons
                  name="calendar-today"
                  size={16}
                  color="#9ca3af"
                />
              </View>
            </View>
          </View>

          {/* Notes & Terms */}
          <View>
            <FieldLabel>Notes & Terms</FieldLabel>
            <TextInput
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-sm font-medium text-[#181114] leading-relaxed"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add contract details or terms here..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
            />
          </View>
        </View>

        {/* ── Payment History ── */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-extrabold tracking-tight text-[#181114]">
            Payment History
          </Text>
          <TouchableOpacity
            className="flex-row items-center gap-1 bg-[#ee2b8c]/5 px-3 py-1.5 rounded-full"
            activeOpacity={0.7}
          >
            <MaterialIcons name="add" size={14} color="#ee2b8c" />
            <Text className="text-[10px] font-extrabold uppercase tracking-widest text-[#ee2b8c]">
              Log Payment
            </Text>
          </TouchableOpacity>
        </View>

        {payments.map((p) => (
          <PaymentRow key={p.id} item={p} />
        ))}

        {/* ── Save Button ── */}
        <TouchableOpacity
          className="w-full bg-[#ee2b8c] py-5 rounded-2xl flex-row items-center justify-center gap-3 shadow-lg mt-4"
          activeOpacity={0.85}
          onPress={handleSave}
        >
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text className="text-white font-extrabold text-sm uppercase tracking-widest">
            Update Budget
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* <RemainingBalanceBar remaining={remaining} /> */}
    </SafeAreaView>
  );
}
