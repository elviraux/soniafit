import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

type InfoSection = 'help' | 'terms' | 'privacy';

const CONTENT: Record<InfoSection, { title: string; sections: { heading: string; content: string }[] }> = {
  help: {
    title: 'HELP & SUPPORT',
    sections: [
      {
        heading: 'Contact Us',
        content: 'For any questions or concerns, please reach out to our customer service team:\n\nEmail: support@soniahou.com\nPhone: 1-800-SONIA-HOU\nHours: Mon-Fri 9AM-6PM EST',
      },
      {
        heading: 'Shipping Information',
        content: 'We offer FREE shipping on all orders over $50. Standard shipping takes 3-5 business days. Express shipping (1-2 business days) is available for an additional fee.\n\nAll orders are processed within 24 hours and shipped from our warehouse in New York.',
      },
      {
        heading: 'Returns & Exchanges',
        content: 'We accept returns within 30 days of purchase. Items must be in original condition with tags attached.\n\nTo initiate a return, please contact our customer service team with your order number.',
      },
      {
        heading: 'Order Tracking',
        content: 'Once your order ships, you will receive a confirmation email with tracking information. You can also track your order by logging into your account.',
      },
      {
        heading: 'Payment Methods',
        content: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Afterpay for interest-free installment payments.',
      },
    ],
  },
  terms: {
    title: 'TERMS & CONDITIONS',
    sections: [
      {
        heading: 'Agreement to Terms',
        content: 'By accessing or using the SONIA HOU mobile application, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.',
      },
      {
        heading: 'Use of Service',
        content: 'You may use our service for lawful purposes only. You agree not to:\n\n• Use the service for any illegal purpose\n• Attempt to gain unauthorized access\n• Interfere with the proper working of the service\n• Copy or distribute any content without permission',
      },
      {
        heading: 'Products and Pricing',
        content: 'All prices are listed in US dollars and are subject to change without notice. We reserve the right to modify or discontinue any product at any time.\n\nWhile we strive for accuracy, errors in pricing may occur. We reserve the right to correct any errors and cancel orders placed at incorrect prices.',
      },
      {
        heading: 'Intellectual Property',
        content: 'All content, including but not limited to logos, images, text, and designs, are the property of SONIA HOU and are protected by copyright and trademark laws.',
      },
      {
        heading: 'Limitation of Liability',
        content: 'SONIA HOU shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.',
      },
    ],
  },
  privacy: {
    title: 'PRIVACY POLICY',
    sections: [
      {
        heading: 'Information We Collect',
        content: 'We collect information you provide directly, including:\n\n• Name and contact information\n• Billing and shipping addresses\n• Payment information\n• Order history\n• Communication preferences',
      },
      {
        heading: 'How We Use Your Information',
        content: 'We use your information to:\n\n• Process and fulfill orders\n• Send order confirmations and updates\n• Provide customer support\n• Send promotional communications (with your consent)\n• Improve our products and services',
      },
      {
        heading: 'Information Sharing',
        content: 'We do not sell your personal information. We may share your information with:\n\n• Service providers who assist in our operations\n• Payment processors\n• Shipping carriers\n• Legal authorities when required by law',
      },
      {
        heading: 'Data Security',
        content: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.',
      },
      {
        heading: 'Your Rights',
        content: 'You have the right to:\n\n• Access your personal information\n• Correct inaccurate information\n• Request deletion of your data\n• Opt-out of marketing communications\n\nContact us at privacy@soniahou.com to exercise these rights.',
      },
      {
        heading: 'Cookies',
        content: 'We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can manage cookie preferences through your device settings.',
      },
    ],
  },
};

export default function InfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();

  const [activeSection, setActiveSection] = useState<InfoSection>(
    (params.type as InfoSection) || 'help'
  );

  const content = CONTENT[activeSection];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{content.title}</Text>
        <View style={styles.backButton} />
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'help' && styles.tabActive]}
          onPress={() => setActiveSection('help')}
        >
          <Text style={[styles.tabText, activeSection === 'help' && styles.tabTextActive]}>
            Help
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'terms' && styles.tabActive]}
          onPress={() => setActiveSection('terms')}
        >
          <Text style={[styles.tabText, activeSection === 'terms' && styles.tabTextActive]}>
            Terms
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'privacy' && styles.tabActive]}
          onPress={() => setActiveSection('privacy')}
        >
          <Text style={[styles.tabText, activeSection === 'privacy' && styles.tabTextActive]}>
            Privacy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {content.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last updated: January 2024
          </Text>
          <Text style={styles.footerText}>
            © 2024 SONIA HOU. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textLight,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeading: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  sectionContent: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    lineHeight: 22,
  },
  footer: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
});
