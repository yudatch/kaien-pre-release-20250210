"use client";

/**
 * TODO: バックエンド実装
 * 1. テンプレート取得API
 *    - GET /api/invoices/templates/:id
 *    - レスポンス: TemplateData型に準拠したJSON
 * 
 * 2. テンプレート更新API
 *    - PUT /api/invoices/templates/:id
 *    - リクエストボディ: TemplateData型に準拠したJSON
 *    - バリデーション:
 *      - name: 必須、最大100文字
 *      - description: 最大500文字
 *      - sections: 最低1つ以上必要
 *      - section.title: 必須、最大50文字
 *      - section.content: 種類に応じた適切なバリデーション
 * 
 * 3. エラーレスポンス
 *    - 404: テンプレートが存在しない
 *    - 400: バリデーションエラー
 *    - 500: サーバーエラー
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ListPageLayout } from '@/app/components/core/layout/ListPageLayout';
import TemplateForm, { TemplateData } from '@/app/components/features/templates/TemplateForm';

// ダミーデータ
const dummyTemplate: TemplateData = {
  id: '1',
  name: '標準請求書テンプレート',
  description: '一般的な工事案件向けの標準テンプレート',
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
      content: {
        headers: ['項目', '数量', '単価', '金額', '備考'],
        widths: [300, 100, 150, 150, 200]
      }
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
      content: {
        position: 'right',
        title: '承認者',
        date: true
      }
    }
  ]
};

export default function TemplateEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [template, setTemplate] = useState<TemplateData>(dummyTemplate);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // APIコールは一時的にコメントアウト
    // fetch(`/api/templates/${id}`)
    //   .then(res => res.json())
    //   .then(data => setTemplate(data))
    //   .catch(error => console.error('Error:', error));
    setTimeout(() => {
      setLoading(false);
      setTemplate(dummyTemplate);
    }, 1000);
  }, [id]);

  const handleSave = async (updatedTemplate: TemplateData) => {
    try {
      // APIコールは一時的にコメントアウト
      // await fetch(`/api/templates/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updatedTemplate),
      // });
      console.log('Template saved:', updatedTemplate);
      router.push('/projects/invoices');
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleCancel = () => {
    router.push('/projects/invoices');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ListPageLayout
      title="テンプレート編集"
      addButtonLabel={undefined}
    >
      <TemplateForm
        template={template}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </ListPageLayout>
  );
} 