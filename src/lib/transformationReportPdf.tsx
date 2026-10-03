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
const LINE = "#dde5de";
const PAPER = "#f4f7f4";

export interface ClassBand {
  range: string;
  name: string;
  tagline: string;
  body: string;
  current: boolean;
}

export interface FullPillarStatus {
  id: number;
  name: string;
  score: number;
  yesCount: number;
  maturityStage: string;
  brief: string;
}

export interface PriorityCapability {
  pillarId: number;
  pillarName: string;
  id: string;
  name: string;
  yes: number;
  feedback: string;
}

export interface TransformationReportData {
  logoDataUrl?: string | null;
  generatedAt: string;
  reportId: string;
  verifyUrl: string;
  qrDataUrl?: string | null;
  farm: {
    farmName: string;
    farmId: string;
    ownerManager: string;
    location: string;
    farmType: string;
    farmSize: string;
    assessmentDate: string;
    nextAssessmentDate: string;
  };
  ffmi: { score24: number; overallPercent: number };
  bands: ClassBand[];
  pillars: FullPillarStatus[];
  priorities: PriorityCapability[];
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
  watermark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.055,
  },
  watermarkLogo: { width: 340, height: 340, objectFit: "contain" },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  logo: { width: 150, height: 49, objectFit: "contain" },
  brandBlock: { marginLeft: 12, borderLeftWidth: 2, borderLeftColor: GOLD, paddingLeft: 12 },
  brandName: { fontSize: 15, fontWeight: "bold", color: TEAL, letterSpacing: 1 },
  brandSub: { fontSize: 8, color: MUTED, marginTop: 2 },
  goldRule: { height: 3, backgroundColor: GOLD, marginVertical: 10 },
  reportTitle: { fontSize: 21, fontWeight: "bold", color: TEAL, marginBottom: 2 },
  reportSub: { fontSize: 9.5, color: MUTED, marginBottom: 10 },
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
  heroBox: { borderRadius: 10, padding: 14, marginBottom: 4, backgroundColor: TEAL },
  heroScoreRow: { flexDirection: "row", alignItems: "center" },
  heroScore: { fontSize: 38, fontWeight: "bold", color: "#ffffff" },
  heroScoreSuffix: { fontSize: 15, color: "#ffffff", opacity: 0.85 },
  heroMeta: { marginLeft: 14, flex: 1 },
  heroTier: { fontSize: 13, fontWeight: "bold", color: "#ffffff" },
  heroSub: { fontSize: 8.5, color: "#ffffff", opacity: 0.9, marginTop: 2 },
  bandRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 8,
    padding: 9,
    marginBottom: 6,
  },
  bandRowCurrent: { borderColor: GREEN, borderWidth: 1.5, backgroundColor: "#f2faf2" },
  bandRange: { width: 44, fontSize: 10, fontWeight: "bold", color: TEAL },
  bandBody: { flex: 1, paddingLeft: 8 },
  bandName: { fontSize: 10, fontWeight: "bold", color: INK },
  bandTag: { fontSize: 9, fontWeight: "bold", color: GREEN, marginTop: 1 },
  bandText: { fontSize: 8.5, color: INK, marginTop: 2, lineHeight: 1.5 },
  idGrid: { flexDirection: "row", flexWrap: "wrap", backgroundColor: PAPER, borderRadius: 8, padding: 10, marginBottom: 4 },
  idCell: { width: "50%", paddingVertical: 3, paddingRight: 8 },
  idLabel: { fontSize: 7.5, color: MUTED, textTransform: "uppercase", letterSpacing: 0.5 },
  idValue: { fontSize: 9.5, fontWeight: "bold", color: INK, marginTop: 1 },
  pillarRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: LINE },
  pillarNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: TEAL,
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 5,
  },
  pillarBody: { flex: 1, paddingLeft: 9, paddingRight: 8 },
  pillarName: { fontSize: 9.5, fontWeight: "bold", color: INK },
  pillarBrief: { fontSize: 8.5, color: MUTED, marginTop: 1, lineHeight: 1.45 },
  pillarScore: { fontSize: 12, fontWeight: "bold", color: TEAL, width: 52, textAlign: "right" },
  prioBox: { borderWidth: 1, borderColor: LINE, borderRadius: 8, padding: 9, marginBottom: 7 },
  prioHead: { fontSize: 9.5, fontWeight: "bold", color: INK, marginBottom: 2 },
  prioMeta: { fontSize: 8, fontWeight: "bold", color: GOLD, marginBottom: 3 },
  prioText: { fontSize: 8.5, color: INK, lineHeight: 1.5 },
  verifyBox: { flexDirection: "row", borderWidth: 1, borderColor: LINE, borderRadius: 10, padding: 12, marginTop: 8, alignItems: "center" },
  qr: { width: 110, height: 110 },
  verifyBody: { flex: 1, paddingLeft: 12 },
  verifyTitle: { fontSize: 11, fontWeight: "bold", color: TEAL },
  verifyText: { fontSize: 8.5, color: INK, marginTop: 3, lineHeight: 1.5 },
  verifyRef: { fontSize: 9, fontWeight: "bold", color: INK, marginTop: 5 },
  signoff: { marginTop: 18, alignItems: "center" },
  signoffMain: { fontSize: 11, fontWeight: "bold", color: TEAL, letterSpacing: 0.5 },
  signoffSub: { fontSize: 8.5, color: MUTED, marginTop: 3 },
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

function shortBandName(name: string): string {
  return name.replace(/\s*-?\s*Farm Business$/i, "").trim();
}

function Watermark({ logo }: { logo?: string | null }) {
  if (!logo) return null;
  return (
    <View style={styles.watermark} fixed>
      <Image src={logo} style={styles.watermarkLogo} />
    </View>
  );
}

export default function TransformationReportPdf({
  data,
}: {
  data: TransformationReportData;
} & DocumentProps) {
  return (
    <Document
      title="Future Farms Transformation Report"
      author="Future Farms"
      subject="FFMI/24 full transformation report"
    >
      <Page size="A4" style={styles.page}>
        <Watermark logo={data.logoDataUrl} />
        <View>
          <View style={styles.headerRow}>
            {data.logoDataUrl ? <Image src={data.logoDataUrl} style={styles.logo} /> : null}
            <View style={styles.brandBlock}>
              <Text style={styles.brandName}>FUTURE FARMS</Text>
              <Text style={styles.brandSub}>Farm Maturity Assessment • Verification • Growth</Text>
            </View>
          </View>
          <View style={styles.goldRule} />
          <Text style={styles.reportTitle}>Future Farms Transformation Report</Text>
          <Text style={styles.reportSub}>
            Full 8-pillar assessment • Generated {data.generatedAt} • Report {data.reportId}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Farm classification &amp; FFMI Index</Text>
        <View style={styles.heroBox}>
          <View style={styles.heroScoreRow}>
            <Text style={styles.heroScore}>
              {data.ffmi.score24}
              <Text style={styles.heroScoreSuffix}>/24</Text>
            </Text>
            <View style={styles.heroMeta}>
              <Text style={styles.heroTier}>
                {shortBandName(data.bands.find((b) => b.current)?.name ?? "")}
              </Text>
              <Text style={styles.heroSub}>
                Overall maturity {data.ffmi.overallPercent}% across all 8 submitted pillars
              </Text>
            </View>
          </View>
        </View>
        {data.bands
          .filter((b) => b.current)
          .map((b) => (
            <View key={b.range} style={[styles.bandRow, styles.bandRowCurrent]} wrap={false}>
              <Text style={styles.bandRange}>{b.range}</Text>
              <View style={styles.bandBody}>
                <Text style={styles.bandName}>{shortBandName(b.name)}</Text>
                <Text style={styles.bandTag}>{b.tagline}</Text>
                <Text style={styles.bandText}>{b.body}</Text>
              </View>
            </View>
          ))}

        <Text style={styles.sectionTitle}>Basic Farm ID</Text>
        <View style={styles.idGrid}>
          {[
            ["Farm / Business Name", data.farm.farmName],
            ["Farm ID", data.farm.farmId],
            ["Owner / Manager", data.farm.ownerManager],
            ["Location", data.farm.location],
            ["Farm Type", data.farm.farmType],
            ["Farm Size", data.farm.farmSize],
            ["Assessment Date", data.farm.assessmentDate],
            ["Next Assessment Date", data.farm.nextAssessmentDate],
          ].map(([label, value]) => (
            <View key={label} style={styles.idCell}>
              <Text style={styles.idLabel}>{label}</Text>
              <Text style={styles.idValue}>{value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Pillar Status — all 8 pillars</Text>
        {data.pillars.map((p) => (
          <View key={p.id} style={styles.pillarRow} wrap={false}>
            <Text style={styles.pillarNum}>{p.id}</Text>
            <View style={styles.pillarBody}>
              <Text style={styles.pillarName}>{p.name}</Text>
              <Text style={styles.pillarBrief}>
                {p.maturityStage}: {p.brief}
              </Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>
          Development Priorities as of {data.farm.assessmentDate}
        </Text>
        <Text style={[styles.pillarBrief, { marginBottom: 6 }]}>
          Capabilities scoring 3 or less out of 5, in pillar order — start here.
        </Text>
        {data.priorities.length === 0 ? (
          <Text style={styles.pillarBrief}>
            No capabilities at or below 3 out of 5. Maintain current practices and aim higher.
          </Text>
        ) : (
          data.priorities.map((c) => (
            <View key={c.id} style={styles.prioBox}>
              <Text style={styles.prioHead}>
                P{c.pillarId} • {c.name}
              </Text>
              <Text style={styles.prioMeta}>
                {c.yes} of 5 • {c.pillarName}
              </Text>
              <Text style={styles.prioText}>{c.feedback}</Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Verified report</Text>
        <View style={styles.verifyBox} wrap={false}>
          {data.qrDataUrl ? <Image src={data.qrDataUrl} style={styles.qr} /> : null}
          <View style={styles.verifyBody}>
            <Text style={styles.verifyTitle}>Scan to verify this report</Text>
            <Text style={styles.verifyText}>
              This document is a verified Future Farms Transformation Report. Scanning the
              code opens its live verification record.
            </Text>
            <Text style={styles.verifyRef}>Reference: {data.reportId}</Text>
          </View>
        </View>

        <View style={styles.signoff}>
          <Text style={styles.signoffMain}>OurFarms.OurFuture</Text>
          <Text style={styles.signoffSub}>
            Future Farms Initiative | An initiative of Arbarne Agriculture Group
          </Text>
        </View>

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
