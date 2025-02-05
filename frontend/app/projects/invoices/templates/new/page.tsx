"use client";

/**
 * TODO: バックエンド実装
 * 1. テンプレート作成API
 *    - POST /api/invoices/templates
 *    - リクエストボディ: TemplateData型に準拠したJSON（idは不要）
 *    - レスポンス: 作成されたテンプレート（TemplateData型）
 * 
 * 2. バリデーション
 *    - name: 必須、最大100文字
 *    - description: 最大500文字
 *    - sections: 最低1つ以上必要
 *    - section.title: 必須、最大50文字
 *    - section.content: 種類に応じた適切なバリデーション
 * 
 * 3. エラーレスポンス
 *    - 400: バリデーションエラー
 *    - 500: サーバーエラー
 */

import { useRouter } from 'next/navigation';
import { ListPageLayout } from '@/app/components/core/layout/ListPageLayout';
import TemplateForm, { TemplateData } from '@/app/components/features/templates/TemplateForm';

// 新規テンプレートの初期データ
const initialTemplate: TemplateData = {
  id: '',
  name: '',
  description: '',
  sections: [
    {
      id: 'section1',
      title: '請求書タイトル',
      type: 'text',
      content: '御請求書'
    },
    {
      id: 'section2',
      title: '明細表',
      type: 'table',
      content: JSON.stringify({
        headers: ['項目', '数量', '単価', '金額', '備考'],
        widths: [300, 100, 150, 150, 200]
      })
    },
    {
      id: 'section3',
      title: '振込先情報',
      type: 'text',
      content: '振込先：○○銀行 △△支店\n口座番号：普通 1234567\n口座名義：カブシキガイシャ カイエン'
    },
    {
      id: 'section4',
      title: '備考欄',
      type: 'text',
      content: '※お支払期限：請求書発行日より30日以内\n※振込手数料は貴社にてご負担ください。'
    },
    {
      id: 'section5',
      title: '署名欄',
      type: 'signature',
      content: JSON.stringify({
        position: 'right',
        title: '承認者',
        date: true
      })
    }
  ]
};

export default function NewTemplatePage() {
  const router = useRouter();

  const handleSave = async (template: TemplateData) => {
    try {
      // APIコールは一時的にコメントアウト
      // const response = await fetch('/api/templates', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(template),
      // });
      // if (!response.ok) throw new Error('Failed to create template');
      console.log('Template created:', template);
      router.push('/projects/invoices');
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleCancel = () => {
    router.push('/projects/invoices');
  };

  return (
    <ListPageLayout
      title="テンプレート作成"
      addButtonLabel={undefined}
    >
      <TemplateForm
        template={initialTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </ListPageLayout>
  );
} 