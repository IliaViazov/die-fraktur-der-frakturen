import UIKit
import WebKit

class ViewController: UIViewController, WKScriptMessageHandler {
    private var webView: WKWebView!
    
    // Set to true by SceneDelegate when this instance is on the projector
    var isExternalDisplay: Bool = false
    
    // Store the external screen reference
    var externalScreen: UIScreen?
    
    override var prefersStatusBarHidden: Bool { true }
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask { .landscape }

    override func loadView() {
        let configuration = WKWebViewConfiguration()
        let preferences = WKPreferences()
        preferences.javaScriptEnabled = true
        configuration.preferences = preferences
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.allowsAirPlayForMediaPlayback = true
        
        // Message handler so JS can notify Swift when the iPad starts the piece
        configuration.userContentController.add(self, name: "appBridge")
        
        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.backgroundColor = .black
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        loadLocalWebsite()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        // If this is the external display, we don't need to do anything special
        // The window is already set up by SceneDelegate
        if isExternalDisplay {
            print("📺 ViewController running on external display (projector)")
        }
    }

    private func loadLocalWebsite() {
        guard let indexURL = Bundle.main.url(
            forResource: "index",
            withExtension: "html",
            subdirectory: "Website"
        ) else {
            showError("Local website bundle could not be found.")
            return
        }
        webView.loadFileURL(indexURL, allowingReadAccessTo: indexURL.deletingLastPathComponent())
        
        // Once the page loads, if this is the projector, auto-start immediately
        if isExternalDisplay {
            webView.navigationDelegate = self
        }
    }

    // Triggers handleStart() in JS, bypassing the button
    private func autoStart() {
        webView.evaluateJavaScript("handleStart();", completionHandler: nil)
    }

    // MARK: - WKScriptMessageHandler
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        // Reserved for future iPad→projector sync if needed
    }

    // MARK: - Error
    private func showError(_ message: String) {
        let label = UILabel()
        label.text = message
        label.textColor = .white
        label.numberOfLines = 0
        label.textAlignment = .center
        label.backgroundColor = .black
        view = label
    }
}

// MARK: - WKNavigationDelegate (external display only)
extension ViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        if isExternalDisplay {
            autoStart()
        }
    }
}
