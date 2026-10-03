import React from "react";
import {
  Document,
  DocumentProps,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const TEAL = "#045d61";
const GREEN = "#009924";
const GOLD = "#b8860b";
const INK = "#1a2b2c";
const MUTED = "#5f6f6b";
const PAPER = "#f4f7f4";
const LINE = "#dde5de";

export interface PdfCapability {
  id: string;
  name: string;
  focus: string;
  maturity: string;
  statusFeedback: string;
}

export interface PdfGap {
  questionId: string;
  question: string;
  recommendation?: string | null;
  whyItMatters?: string | null;
  quickWin?: string | null;
  priority?: string | null;
}

export interface PillarReportData {
  logoDataUrl?: string | null;
  generatedAt: string;
  reportId: string;
  farm: {
    farmName: string;
    ownerName: string;
    email: string;
    phone: string;
    valueChain: string;
    experienceYears: string;
  };
  pillar: {
    id: number;
    name: string;
    score: number;
    gapCount: number;
    maturityStage: string;
      recommendation: string;
    maturityDescription: string;
    guidingQuestion: string;
    accentColor: string;
  };
  capabilities: PdfCapability[];
  gaps: PdfGap[];
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: INK,
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    backgroundColor: "#ffffff",
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  logo: { width: 150, height: 49, objectFit: "contain" },
  brandBlock: { marginLeft: 12, borderLeftWidth: 2, borderLeftColor: GOLD, paddingLeft: 12 },
  brandName: { fontSize: 15, fontWeight: "bold", color: TEAL, letterSpacing: 1 },
  brandSub: { fontSize: 8, color: MUTED, marginTop: 2 },
  goldRule: { height: 3, backgroundColor: GOLD, marginVertical: 10 },
  reportTitle: { fontSize: 20, fontWeight: "bold", color: TEAL, marginBottom: 2 },
  reportSub: { fontSize: 9.5, color: MUTED, marginBottom: 10 },
  metaGrid: { flexDirection: "row", flexWrap: "wrap", backgroundColor: PAPER, borderRadius: 8, padding: 10, marginBottom: 12 },
  metaCell: { width: "50%", paddingVertical: 3, paddingRight: 8 },
  metaLabel: { fontSize: 7.5, color: MUTED, textTransform: "uppercase", letterSpacing: 0.5 },
  metaValue: { fontSize: 9.5, fontWeight: "bold", color: INK, marginTop: 1 },
  heroBox: { borderRadius: 10, padding: 14, marginBottom: 12 },
  heroScoreRow: { flexDirection: "row", alignItems: "center" },
  heroScore: { fontSize: 38, fontWeight: "bold", color: "#ffffff" },
  heroScoreSuffix: { fontSize: 15, color: "#ffffff", opacity: 0.85 },
  heroMeta: { marginLeft: 14, flex: 1 },
  heroTier: { fontSize: 13, fontWeight: "bold", color: "#ffffff" },
  heroGuide: { fontSize: 9, color: "#ffffff", opacity: 0.92, marginTop: 6, lineHeight: 1.5 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: TEAL,
    marginTop: 14,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingBottom: 4,
  },
  recoBox: { backgroundColor: PAPER, borderRadius: 8, padding: 10, marginBottom: 4, borderLeftWidth: 3, borderLeftColor: GREEN },
  recoText: { fontSize: 9.5, lineHeight: 1.55, color: INK },
  capBox: { borderWidth: 1, borderColor: LINE, borderRadius: 8, padding: 10, marginBottom: 8 },
  capHeadRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  capName: { fontSize: 10.5, fontWeight: "bold", color: INK, flex: 1, paddingRight: 8 },
  capBadge: { fontSize: 8, fontWeight: "bold", color: TEAL, backgroundColor: "#e6f2f2", borderRadius: 8, paddingVertical: 2, paddingHorizontal: 7 },
  capFocus: { fontSize: 8.5, color: MUTED, fontStyle: "italic", marginBottom: 4, lineHeight: 1.45 },
  capFeedback: { fontSize: 9, lineHeight: 1.5, color: INK },
  gapBox: { backgroundColor: "#fff8f0", borderWidth: 1, borderColor: "#f0dcb8", borderRadius: 8, padding: 9, marginBottom: 7 },
  gapQ: { fontSize: 9.5, fontWeight: "bold", color: INK, marginBottom: 3, lineHeight: 1.45 },
  gapLine: { fontSize: 8.5, color: INK, marginTop: 2, lineHeight: 1.5 },
  gapLabel: { fontWeight: "bold", color: TEAL },
  stampBox: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: GOLD,
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 14,
  },
  stampTitle: { fontSize: 10, fontWeight: "bold", color: GOLD, letterSpacing: 1, textAlign: "center" },
  stampNote: { fontSize: 8, color: MUTED, textAlign: "center", marginTop: 4, lineHeight: 1.5 },
  signRow: { flexDirection: "row", marginTop: 14 },
  signCell: { flex: 1, marginRight: 12 },
  signLine: { borderBottomWidth: 1, borderBottomColor: MUTED, height: 18 },
  signLabel: { fontSize: 7.5, color: MUTED, marginTop: 3 },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: MUTED,
  },
});

function Header({ data }: { data: PillarReportData }) {
  return (
    <View>
      <View style={styles.headerRow}>
        {data.logoDataUrl ? <Image src={data.logoDataUrl} style={styles.logo} /> : null}
        <View style={styles.brandBlock}>
          <Text style={styles.brandName}>FUTURE FARMS</Text>
          <Text style={styles.brandSub}>Farm Maturity Assessment • Verification • Growth</Text>
        </View>
      </View>
      <View style={styles.goldRule} />
      <Text style={styles.reportTitle}>
        Pillar {data.pillar.id} Diagnostic &amp; Action Report
      </Text>
      <Text style={styles.reportSub}>
        {data.pillar.name} • Generated {data.generatedAt} • Report {data.reportId}
      </Text>
      <View style={styles.metaGrid}>
        {[
          ["Farmer", data.farm.ownerName],
          ["Farm", data.farm.farmName],
          ["Email", data.farm.email],
          ["Phone", data.farm.phone || "—"],
          ["Value chain", data.farm.valueChain],
          ["Experience", data.farm.experienceYears],
        ].map(([label, value]) => (
          <View key={label} style={styles.metaCell}>
            <Text style={styles.metaLabel}>{label}</Text>
            <Text style={styles.metaValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function PillarReportPdf({ data }: { data: PillarReportData } & DocumentProps) {
  const accent = data.pillar.accentColor || TEAL;
  return (
    <Document
      title={`Future Farms — Pillar ${data.pillar.id} Report`}
      author="Future Farms"
      subject={`FFMI/24 Pillar ${data.pillar.id} diagnostic report`}
    >
      <Page size="A4" style={styles.page}>
        <Header data={data} />

        <View style={[styles.heroBox, { backgroundColor: accent }]}>
          <View style={styles.heroScoreRow}>
            <Text style={styles.heroScore}>
              {data.pillar.score}
              <Text style={styles.heroScoreSuffix}>%</Text>
            </Text>
            <View style={styles.heroMeta}>
              <Text style={styles.heroTier}>{data.pillar.maturityStage}</Text>
            </View>
          </View>
          <Text style={styles.heroGuide}>{data.pillar.guidingQuestion}</Text>
        </View>

        <Text style={styles.sectionTitle}>Pillar recommendation</Text>
        <View style={styles.recoBox}>
          <Text style={styles.recoText}>{data.pillar.recommendation}</Text>
          <Text style={[styles.recoText, { marginTop: 6 }]}>{data.pillar.maturityDescription}</Text>
        </View>

        <Text style={styles.sectionTitle}>Capability breakdown</Text>
        {data.capabilities.map((c) => (
          <View key={c.id} style={styles.capBox} wrap={false}>
            <View style={styles.capHeadRow}>
              <Text style={styles.capName}>
                {c.id.replace("P", "")} • {c.name}
              </Text>
              <Text style={styles.capBadge}>{c.maturity}</Text>
            </View>
            <Text style={styles.capFocus}>{c.focus}</Text>
            <Text style={styles.capFeedback}>{c.statusFeedback}</Text>
          </View>
        ))}

        {data.gaps.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Priority gaps &amp; recommendations ({data.gaps.length})
            </Text>
            {data.gaps.map((g) => (
              <View key={g.questionId} style={styles.gapBox}>
                <Text style={styles.gapQ}>{g.question}</Text>
                {g.recommendation ? (
                  <Text style={styles.gapLine}>
                    <Text style={styles.gapLabel}>Recommendation: </Text>
                    {g.recommendation}
                  </Text>
                ) : null}
                {g.whyItMatters ? (
                  <Text style={styles.gapLine}>
                    <Text style={styles.gapLabel}>Why it matters: </Text>
                    {g.whyItMatters}
                  </Text>
                ) : null}
                {g.quickWin ? (
                  <Text style={styles.gapLine}>
                    <Text style={styles.gapLabel}>Quick win: </Text>
                    {g.quickWin}
                  </Text>
                ) : null}
              </View>
            ))}
          </>
        )}

        {/* E-STAMP reserved block — hidden until the official digital stamp is designed.
        <View style={styles.stampBox} wrap={false}>
          <Text style={styles.stampTitle}>E-STAMP — RESERVED</Text>
          <Text style={styles.stampNote}>
            Official Future Farms digital stamp to be affixed here. Report {data.reportId} •{" "}
            {data.generatedAt}
          </Text>
          <View style={styles.signRow}>
            <View style={styles.signCell}>
              <View style={styles.signLine} />
              <Text style={styles.signLabel}>Verified by (name &amp; signature)</Text>
            </View>
            <View style={[styles.signCell, { marginRight: 0 }]}>
              <View style={styles.signLine} />
              <Text style={styles.signLabel}>Date</Text>
            </View>
          </View>
        </View>
        */}

        <View style={styles.footer} fixed>
          <Text>Generated by Future Farms • futurefarms.africa</Text>
          <Text
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
