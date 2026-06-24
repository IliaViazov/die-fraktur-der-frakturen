import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    guard let windowScene = scene as? UIWindowScene else { return }
    let window = UIWindow(windowScene: windowScene)

    if windowScene.session.role == .windowExternalDisplay {
      window.rootViewController = ViewController()
    } else {
      window.rootViewController = ViewController()
    }

    self.window = window
    window.makeKeyAndVisible()
  }
}
