<?php
/**
 * Vision Tech PHP Send Message Script / Helper Class
 * 
 * Use this script in your PHP CRM to send WhatsApp text alerts,
 * approved Meta templates, and document/PDF invoice attachments.
 */

require_once __DIR__ . '/config.php';

class VisionTechWhatsApp {
    private $accessToken;
    private $phoneNumberId;
    private $apiUrl;

    public function __construct($accessToken = META_ACCESS_TOKEN, $phoneNumberId = META_PHONE_NUMBER_ID) {
        $this->accessToken = $accessToken;
        $this->phoneNumberId = $phoneNumberId;
        $this->apiUrl = "https://graph.facebook.com/v20.0/{$this->phoneNumberId}/messages";
    }

    /**
     * Send Standard Text Notification
     */
    public function sendTextMessage($recipientPhone, $messageBody) {
        $cleanPhone = preg_replace('/[^0-9]/', '', $recipientPhone);
        
        $payload = [
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $cleanPhone,
            'type' => 'text',
            'text' => [
                'body' => $messageBody
            ]
        ];

        return $this->executeCurl($payload);
    }

    /**
     * Send Approved Meta Template (e.g. task_assignment_alert, lead_assignment_notice)
     */
    public function sendTemplateMessage($recipientPhone, $templateName, array $bodyParameters = [], array $buttonParameters = [], $languageCode = 'en') {
        $cleanPhone = preg_replace('/[^0-9]/', '', $recipientPhone);
        
        $components = [];

        if (!empty($bodyParameters)) {
            $formattedParams = [];
            foreach ($bodyParameters as $val) {
                $formattedParams[] = ['type' => 'text', 'text' => (string)$val];
            }
            $components[] = [
                'type' => 'body',
                'parameters' => $formattedParams
            ];
        }

        if (!empty($buttonParameters)) {
            $formattedButtons = [];
            foreach ($buttonParameters as $val) {
                $formattedButtons[] = ['type' => 'text', 'text' => (string)$val];
            }
            $components[] = [
                'type' => 'button',
                'sub_type' => 'url',
                'index' => '0',
                'parameters' => $formattedButtons
            ];
        }

        $payload = [
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $cleanPhone,
            'type' => 'template',
            'template' => [
                'name' => $templateName,
                'language' => ['code' => $languageCode],
                'components' => $components
            ]
        ];

        return $this->executeCurl($payload);
    }

    /**
     * Send Document / PDF Invoice Attachment
     */
    public function sendDocumentMessage($recipientPhone, $pdfUrl, $fileName = 'Invoice.pdf', $caption = '') {
        $cleanPhone = preg_replace('/[^0-9]/', '', $recipientPhone);
        
        $payload = [
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $cleanPhone,
            'type' => 'document',
            'document' => [
                'link' => $pdfUrl,
                'filename' => $fileName,
                'caption' => $caption
            ]
        ];

        return $this->executeCurl($payload);
    }

    private function executeCurl($payload) {
        $ch = curl_init($this->apiUrl);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->accessToken,
                'Content-Type: application/json'
            ]
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);

        if ($err) {
            return ['success' => false, 'error' => $err];
        }

        $result = json_decode($response, true);
        return [
            'success' => ($httpCode === 200 && isset($result['messages'][0]['id'])),
            'httpCode' => $httpCode,
            'metaMessageId' => $result['messages'][0]['id'] ?? null,
            'response' => $result
        ];
    }
}
