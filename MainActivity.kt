package com.mprlifeline.pcs

import android.app.Activity
import android.content.ContentValues
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.print.PrintAttributes
import android.print.PrintManager
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import java.io.OutputStream

class MainActivity : Activity() {
    private lateinit var web: WebView
    private var fileCallback: ValueCallback<Array<Uri>>? = null
    private val fileRequest = 4102

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        web = WebView(this)
        setContentView(web)
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.allowFileAccess = true
        web.settings.allowContentAccess = true
        web.settings.javaScriptCanOpenWindowsAutomatically = true
        web.webViewClient = WebViewClient()
        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(v: WebView?, callback: ValueCallback<Array<Uri>>?, params: FileChooserParams?): Boolean {
                fileCallback?.onReceiveValue(null)
                fileCallback = callback
                val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "application/json"
                }
                startActivityForResult(Intent.createChooser(intent, "ব্যাকআপ ফাইল নির্বাচন করুন"), fileRequest)
                return true
            }
        }
        web.addJavascriptInterface(AppBridge(), "AndroidBridge")
        web.loadUrl("file:///android_asset/index.html")
    }

    inner class AppBridge {
        @JavascriptInterface fun saveTextFile(name: String, mime: String, content: String) {
            runOnUiThread {
                try {
                    val values = ContentValues().apply {
                        put(MediaStore.Downloads.DISPLAY_NAME, name)
                        put(MediaStore.Downloads.MIME_TYPE, mime.substringBefore(';'))
                        put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/MPR SQUAD")
                    }
                    val uri = contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
                        ?: throw IllegalStateException("ফাইল তৈরি করা যায়নি")
                    contentResolver.openOutputStream(uri).use { stream: OutputStream? ->
                        stream?.write(content.toByteArray(Charsets.UTF_8))
                    }
                    Toast.makeText(this@MainActivity, "Downloads/MPR SQUAD-এ ফাইল সংরক্ষিত হয়েছে", Toast.LENGTH_LONG).show()
                } catch (e: Exception) {
                    Toast.makeText(this@MainActivity, "ফাইল সেভ হয়নি: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
        }

        @JavascriptInterface fun printHtml(html: String) {
            runOnUiThread {
                val printView = WebView(this@MainActivity)
                printView.settings.javaScriptEnabled = true
                printView.webViewClient = object : WebViewClient() {
                    override fun onPageFinished(view: WebView?, url: String?) {
                        val manager = getSystemService(PRINT_SERVICE) as PrintManager
                        val adapter = view?.createPrintDocumentAdapter("MPR_SQUAD_Office_Report")
                        if (adapter != null) manager.print("MPR SQUAD রিপোর্ট", adapter, PrintAttributes.Builder().build())
                    }
                }
                printView.loadDataWithBaseURL("file:///android_asset/", html, "text/html", "UTF-8", null)
            }
        }
    }

    @Deprecated("Deprecated in Android API")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == fileRequest) {
            val result = if (resultCode == RESULT_OK && data?.data != null) arrayOf(data.data!!) else null
            fileCallback?.onReceiveValue(result)
            fileCallback = null
        }
    }

    override fun onBackPressed() {
        if (::web.isInitialized && web.canGoBack()) web.goBack() else super.onBackPressed()
    }
}
