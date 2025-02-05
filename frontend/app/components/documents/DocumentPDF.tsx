import { Document as PDFDocument, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Document } from '@/app/types/models/document';
import { DOCUMENT_TYPE_LABELS } from '@/app/constants/document';

// IPAフォントの登録
Font.register({
  family: 'IPAexGothic',
  src: 'https://moji.or.jp/wp-content/ipafont/IPAexfont/ipaexg.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  documentNumber: {
    fontSize: 12,
    marginBottom: 10,
  },
  customerInfo: {
    marginBottom: 20,
  },
  companyInfo: {
    marginBottom: 20,
    textAlign: 'right',
  },
  table: {
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: '#F5F5F5',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  amountCell: {
    flex: 1,
    padding: 5,
    textAlign: 'right',
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 18,
  },
});

interface DocumentPDFProps {
  data: Document;
}

export function DocumentPDF({ data }: DocumentPDFProps) {
  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 0 }).format(numAmount);
  };

  return (
    <PDFDocument>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>{data.type}</Text>
        </View>

        <View style={styles.customerInfo}>
          {data.project?.customer?.name && (
            <Text>{data.project?.customer?.name} 御中</Text>
          )}
          {data.project?.customer?.postal_code && data.project?.customer?.address && (
            <Text>〒{data.project?.customer?.postal_code}</Text>
          )}
          {data.project?.customer?.address && (
            <Text>{data.project?.customer?.address}</Text>
          )}
        </View>

        <View style={styles.companyInfo}>
          <Text>{process.env.NEXT_PUBLIC_COMPANY_NAME}</Text>
          {process.env.NEXT_PUBLIC_COMPANY_POSTAL_CODE && (
            <Text>〒{process.env.NEXT_PUBLIC_COMPANY_POSTAL_CODE}</Text>
          )}
          {process.env.NEXT_PUBLIC_COMPANY_ADDRESS && (
            <Text>{process.env.NEXT_PUBLIC_COMPANY_ADDRESS}</Text>
          )}
          {process.env.NEXT_PUBLIC_COMPANY_PHONE && (
            <Text>TEL: {process.env.NEXT_PUBLIC_COMPANY_PHONE}</Text>
          )}
          {data.type === 'invoice' && process.env.NEXT_PUBLIC_COMPANY_TAX_ID && (
            <Text>適格請求書発行事業者 登録番号： {process.env.NEXT_PUBLIC_COMPANY_TAX_ID}</Text>
          )}
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>内容</Text>
            <Text style={styles.tableCell}>数量</Text>
            <Text style={styles.amountCell}>単価</Text>
            <Text style={styles.amountCell}>金額</Text>
          </View>

          {data.details?.map((detail, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{detail.productName}</Text>
              <Text style={styles.tableCell}>{formatAmount(detail.quantity)}</Text>
              <Text style={styles.amountCell}>¥{formatAmount(detail.unitPrice)}</Text>
              <Text style={styles.amountCell}>¥{formatAmount(detail.amount)}</Text>
            </View>
          ))}

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.amountCell}>小計</Text>
            <Text style={styles.amountCell}>¥{formatAmount(data.subtotal)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.amountCell}>消費税（10%）</Text>
            <Text style={styles.amountCell}>¥{formatAmount(data.tax_amount)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.amountCell}>合計</Text>
            <Text style={styles.amountCell}>¥{formatAmount(data.total_amount)}</Text>
          </View>
        </View>

        {data.type === 'invoice' && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 10 }}>
              ※ この請求書は、適格請求書等保存方式（インボイス制度）に対応した請求書です。
            </Text>
          </View>
        )}
      </Page>
    </PDFDocument>
  );
} 