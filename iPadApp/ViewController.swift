import UIKit
import WebKit

class ViewController: UIViewController {
  private var webView: WKWebView!

  override var prefersStatusBarHidden: Bool {
    true
  }

  override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
    .landscape
  }

  override func loadView() {
    let configuration = WKWebViewConfiguration()
    let preferences = WKPreferences()
    preferences.javaScriptEnabled = true
    configuration.preferences = preferences
    webView = WKWebView(frame: .zero, configuration: configuration)
    webView.backgroundColor = .black
    view = webView
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    loadLocalWebsite()
  }

  private func loadLocalWebsite() {
    guard let indexURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Website") else {
      showError("Local website bundle could not be found.")
      return
    }

    webView.loadFileURL(indexURL, allowingReadAccessTo: indexURL.deletingLastPathComponent())
  }

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
